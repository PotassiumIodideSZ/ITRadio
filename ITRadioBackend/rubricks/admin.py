from django.contrib import admin
from .models import Rubric

class RubricAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')

admin.site.register(Rubric, RubricAdmin)