# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2015-12-29 00:14
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Infinitive',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('english_name', models.CharField(max_length=125)),
                ('spanish_name', models.CharField(max_length=50)),
            ],
        ),
    ]