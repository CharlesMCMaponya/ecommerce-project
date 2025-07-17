from django.db import models
from django.contrib.auth.models import User

class Product(models.Model):
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    category = models.CharField(max_length=100)
    image = models.ImageField(upload_to='products/', blank=True)
    stock = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    transaction_id = models.CharField(max_length=200, null=True)
    date_ordered = models.DateTimeField(auto_now_add=True)
    complete = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Shipping Information
    shipping_name = models.CharField(max_length=200)
    shipping_email = models.EmailField()
    shipping_phone = models.CharField(max_length=20)
    shipping_address = models.TextField()
    shipping_city = models.CharField(max_length=100)
    shipping_postal_code = models.CharField(max_length=20)
    shipping_country = models.CharField(max_length=100)
    
    # Payment Information
    payment_method = models.CharField(max_length=50)
    
    @property
    def get_cart_total(self):
        orderitems = self.orderitem_set.all()
        total = sum([item.get_total for item in orderitems])
        return total + 50  # Add shipping cost
    
    @property
    def get_cart_items(self):
        orderitems = self.orderitem_set.all()
        return sum([item.quantity for item in orderitems])
    
    def __str__(self):
        return f"Order #{self.id} - {self.date_ordered.strftime('%Y-%m-%d')}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200)  # Product name at time of order
    price = models.DecimalField(max_digits=7, decimal_places=2)  # Price at time of order
    quantity = models.IntegerField(default=0)
    date_added = models.DateTimeField(auto_now_add=True)
    
    @property
    def get_total(self):
        return self.price * self.quantity
    
    def __str__(self):
        return f"{self.quantity}x {self.name} (Order #{self.order.id})"