from django.urls import path, include
from .views import ProductListCreate, ProductRetrieveUpdateDestroy
from . import views

urlpatterns = [
    path('products/', ProductListCreate.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductRetrieveUpdateDestroy.as_view(), name='product-detail'),
    path('create-payment-intent/', views.create_payment_intent, name='create-payment-intent'),
]