import datetime
import openpyxl
from django.utils import timezone
from dateutil.parser import parse as parse_date
from .models import Client, Ticket, ImportLog

class ExcelTicketImporter:
    """
    сервис для  валидации и выгрузок заявок из Excel 
    """
    @staticmethod
    def run_import(excel_file, user):
        workbook = openpyxl.load_workbook(excel_file, data_only=True)
        sheet = workbook.active
        
        # инициализируем счетчики 
        total_rows = 0
        created_count = 0
        updated_count = 0
        skipped_count = 0
        errors_list = []

        # читаем со 2-й  строки 
        for row_idx, row in enumerate(sheet.iter_rows(min_row=2, values_only=True), start=2):
            if not any(row): # если строка пустая  пропускаем её
                continue
                
            total_rows += 1

            # парсим колонки 
            ext_id = str(row[0]).strip() if row[0] is not None else None
            c_email = str(row[1]).strip() if row[1] is not None else None
            c_name = str(row[2]).strip() if row[2] is not None else None
            subject = str(row[3]).strip() if row[3] is not None else None
            desc = str(row[4]).strip() if row[4] is not None else ""
            priority = str(row[5]).strip().lower() if row[5] is not None else "normal"
            status_val = str(row[6]).strip().lower() if row[6] is not None else "new"
            raw_date = row[7]

            # проверка строк и ошибок
            if not ext_id or ext_id == "None" or not subject:
                skipped_count += 1
                errors_list.append({"row": row_idx, "error": "Отсутствует external_id или тема заявки"})
                continue

            if priority not in [choice[0] for choice in Ticket.Priority.choices]:
                skipped_count += 1
                errors_list.append({"row": row_idx, "error": f"Неизвестный приоритет: '{priority}'"})
                continue

            if status_val not in [choice[0] for choice in Ticket.Status.choices]:
                skipped_count += 1
                errors_list.append({"row": row_idx, "error": f"Неизвестный статус: '{status_val}'"})
                continue

            # валидация дат
            parsed_created_at = None
            if isinstance(raw_date, datetime.datetime):
                parsed_created_at = timezone.make_aware(raw_date) if timezone.is_naive(raw_date) else raw_date
            elif raw_date:
                try:
                    parsed_created_at = timezone.make_aware(parse_date(str(raw_date)))
                except Exception:
                    skipped_count += 1
                    errors_list.append({"row": row_idx, "error": f"Не точная или нечитаемая дата создания: '{raw_date}'"})
                    continue
            else:
                parsed_created_at = timezone.now()

            # анонимный клиент
            if not c_email or "@" not in c_email:
                c_email = "anonymous@helpdesk.ru"
                c_name = c_name or "Анонимный клиент"

            # создаём или находим клиента 
            client_obj, _ = Client.objects.get_or_create(
                email=c_email,
                defaults={"name": c_name or c_email, "company": "Импортировано из CRM"}
            )

            # ищем существующую заявку
            ticket_obj = Ticket.objects.filter(external_id=ext_id).first()
            
            if ticket_obj:
                # обновляем поля существующей заявки 
                ticket_obj.client = client_obj
                ticket_obj.subject = subject
                ticket_obj.description = desc
                ticket_obj.priority = priority
                ticket_obj.status = status_val
                ticket_obj.created_at = parsed_created_at
                ticket_obj.save()
                updated_count += 1
            else:
                # создаем новую заявку 
                Ticket.objects.create(
                    external_id=ext_id,
                    client=client_obj,
                    subject=subject,
                    description=desc,
                    priority=priority,
                    status=status_val,
                    created_at=parsed_created_at
                )
                created_count += 1

        # фиксация результатов в журнал
        log_obj = ImportLog.objects.create(
            user=user,
            file_name=excel_file.name,
            total_rows=total_rows,
            created_count=created_count,
            updated_count=updated_count,
            skipped_count=skipped_count,
            errors=errors_list
        )
        return log_obj
