from django.urls import path
from .views import (
    ProductListCreate,
    ProductRetrieveUpdateDestroy,
    OrderList,
    OrderDetail,
    CreateOrder,
    create_payment_intent,
    confirm_payment
)

urlpatterns = [
    # Product endpoints
    path('products/', ProductListCreate.as_view(), name='product-list'),
    path('products/<int:pk>/', ProductRetrieveUpdateDestroy.as_view(), name='product-detail'),
    
    # Payment endpoints
    path('create-payment-intent/', create_payment_intent, name='create-payment-intent'),
    path('confirm-payment/', confirm_payment, name='confirm-payment'),
    
    # Order endpoints
    path('orders/', OrderList.as_view(), name='order-list'),
    path('orders/<int:pk>/', OrderDetail.as_view(), name='order-detail'),
    path('create-order/', CreateOrder.as_view(), name='create-order'),
]