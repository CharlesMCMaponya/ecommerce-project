from rest_framework import serializers
from .models import Product, Order, OrderItem

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(max_length=None, use_url=True)
    
    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'description', 'category', 'image', 'stock', 'created_at']
        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Ensure image URL is absolute
        if representation['image']:
            request = self.context.get('request')
            if request:
                representation['image'] = request.build_absolute_uri(representation['image'])
        return representation

class OrderItemSerializer(serializers.ModelSerializer):
    get_total = serializers.ReadOnlyField()
    
    class Meta:
        model = OrderItem
        fields = ['id', 'name', 'price', 'quantity', 'get_total', 'date_added']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(source='orderitem_set', many=True, read_only=True)
    get_cart_total = serializers.ReadOnlyField()
    get_cart_items = serializers.ReadOnlyField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'transaction_id', 'date_ordered', 'status', 'complete',
            'get_cart_total', 'get_cart_items',
            'shipping_name', 'shipping_email', 'shipping_phone', 'shipping_address',
            'shipping_city', 'shipping_postal_code', 'shipping_country',
            'payment_method', 'items'
        ]
        read_only_fields = ['id', 'date_ordered', 'get_cart_total', 'get_cart_items']

class OrderCreateSerializer(serializers.ModelSerializer):
    items = serializers.ListField(write_only=True)
    
    class Meta:
        model = Order
        fields = [
            'shipping_name', 'shipping_email', 'shipping_phone', 'shipping_address',
            'shipping_city', 'shipping_postal_code', 'shipping_country',
            'payment_method', 'items'
        ]
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        for item_data in items_data:
            product_id = item_data.get('product_id')
            quantity = item_data.get('quantity', 1)
            
            try:
                product = Product.objects.get(id=product_id)
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    name=product.name,
                    price=product.price,
                    quantity=quantity
                )
            except Product.DoesNotExist:
                continue
        
        return order

class OrderUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']
        
    def validate_status(self, value):
        valid_statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
        if value not in valid_statuses:
            raise serializers.ValidationError(f"Invalid status. Must be one of: {valid_statuses}")
        return value