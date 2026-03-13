import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = "django-insecure-abin-waste-management-system-secret-key"

DEBUG = True
ALLOWED_HOSTS = ["127.0.0.1", "localhost"]
CORS_ALLOW_ALL_ORIGINS = True

INSTALLED_APPS = [
'django.contrib.admin',
'django.contrib.auth',
'django.contrib.contenttypes',
'django.contrib.sessions',
'django.contrib.messages',
'django.contrib.staticfiles',
'rest_framework',
'rest_framework.authtoken',
'accounts',
'waste.apps.WasteConfig',
'requests',
'corsheaders',
]

MIDDLEWARE = [
'corsheaders.middleware.CorsMiddleware',
'django.middleware.security.SecurityMiddleware',
'whitenoise.middleware.WhiteNoiseMiddleware',
'django.contrib.sessions.middleware.SessionMiddleware',
'django.middleware.common.CommonMiddleware',
'django.middleware.csrf.CsrfViewMiddleware',
'django.contrib.auth.middleware.AuthenticationMiddleware',
'django.contrib.messages.middleware.MessageMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [{
'BACKEND':'django.template.backends.django.DjangoTemplates',
'APP_DIRS':True,
'OPTIONS':{'context_processors':[
'django.template.context_processors.request',
'django.contrib.auth.context_processors.auth',
'django.contrib.messages.context_processors.messages',
]},
}]


DATABASES = {
'default': {
'ENGINE': 'django.db.backends.mysql',
'NAME':'djangoprojects',
'USER': 'root',
'PASSWORD': 'Abin@2003',
'HOST': 'localhost'
}
}

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR,'media')

AUTH_USER_MODEL = 'accounts.User'

REST_FRAMEWORK = {
'DEFAULT_AUTHENTICATION_CLASSES': [
'rest_framework.authentication.TokenAuthentication'
],
'DEFAULT_PERMISSION_CLASSES': [
'rest_framework.permissions.AllowAny'
]
}

# ================= EMAIL SETTINGS =================

EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True

EMAIL_HOST_USER = "abinabiabiabi123@gmail.com"
EMAIL_HOST_PASSWORD = "bjvd kgww rekt thye"
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER