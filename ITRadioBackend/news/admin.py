from django.contrib import admin
from .models import News

class NewsAdmin(admin.ModelAdmin):
    list_display = ('name', 'date')  # поля, которые будут отображаться
    ordering = ('-date',)  # сортировка по дате в обратном порядке

admin.site.register(News, NewsAdmin)
