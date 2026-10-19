from django.shortcuts import render, redirect
from django.contrib import messages
from .services import ExcelTicketImporter

def excel_import_admin_view(model_admin, request):
    """
    View для страницы загрузки Excel.   
    """
    if request.method == "POST" and request.FILES.get("excel_file"):
        excel_file = request.FILES["excel_file"]
        
        try:
            # запуск сервиса
            log_obj = ExcelTicketImporter.run_import(excel_file, request.user)
            
            messages.success(
                request, 
                f"Импорт успешно завершен! Обработано строк: {log_obj.total_rows}. "
                f"Создано заявок: {log_obj.created_count}, Обновлено: {log_obj.updated_count}, Пропущено: {log_obj.skipped_count}."
            )
            # перенаправляем пользователя на страницу логов 
            return redirect("admin:HelpDesk_importlog_changelist")
            
        except Exception as e:
            messages.error(request, f"Сбой обработки файла Excel: {str(e)}")
            return redirect("admin:HelpDesk_ticket_changelist")

    # передаем контекст админки
    context = {
        **model_admin.admin_site.each_context(request),
        "opts": model_admin.model._meta,
        "title": "Импорт заявок из старой CRM системы",
    }
    return render(request, "admin/ticket_excel_import.html", context)
