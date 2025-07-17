# products/serializers.py
from rest_framework import serializers
from .models import Product

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