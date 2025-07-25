from rest_framework import generics, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django.conf import settings
import stripe
from .models import Product, Order, OrderItem
from .serializers import ProductSerializer, OrderSerializer

# Set Stripe API key
stripe.api_key = settings.STRIPE_SECRET_KEY

class ProductListCreate(generics.ListCreateAPIView):
    """
    List all products or create a new product
    GET /api/products/ - List all products
    POST /api/products/ - Create new product
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

class ProductRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a specific product
    GET /api/products/{id}/ - Get single product
    PUT /api/products/{id}/ - Update product
    DELETE /api/products/{id}/ - Delete product
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'id'  # Explicitly set lookup field to 'id'

class OrderList(generics.ListAPIView):
    """
    List all orders for the authenticated user
    GET /api/orders/ - Get user's orders
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by('-date_ordered')

class OrderDetail(generics.RetrieveAPIView):
    """
    Retrieve a specific order for the authenticated user
    GET /api/orders/{id}/ - Get order details
    """
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

class CreateOrder(APIView):
    """
    Create a new order after checkout
    POST /api/create-order/
    
    Expected request body:
    {
        "cart": [
            {"id": 1, "quantity": 2},
            {"id": 3, "quantity": 1}
        ],
        "shipping_info": {
            "name": "John Doe",
            "email": "john@example.com",
            "phone": "1234567890",
            "address": "123 Main St",
            "city": "Cape Town",
            "postalCode": "8000",
            "country": "South Africa"
        },
        "payment_method": "card"
    }
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        user = request.user
        cart = request.data.get('cart', [])
        shipping_info = request.data.get('shipping_info', {})
        payment_method = request.data.get('payment_method', 'card')
        
        # Create order
        order = Order.objects.create(
            user=user,
            payment_method=payment_method,
            status='pending',
            shipping_name=shipping_info.get('name', ''),
            shipping_email=shipping_info.get('email', ''),
            shipping_phone=shipping_info.get('phone', ''),
            shipping_address=shipping_info.get('address', ''),
            shipping_city=shipping_info.get('city', ''),
            shipping_postal_code=shipping_info.get('postalCode', ''),
            shipping_country=shipping_info.get('country', 'South Africa')
        )
        
        # Create order items
        for item in cart:
            try:
                product = Product.objects.get(id=item['id'])
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    name=product.name,
                    price=product.price,
                    quantity=item['quantity']
                )
            except Product.DoesNotExist:
                # Skip missing products but log the error
                # Consider adding proper error handling for production
                continue
        
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def create_payment_intent(request):
    """
    Create a Stripe PaymentIntent for processing payments
    POST /api/create-payment-intent/
    
    Expected request body:
    {
        "amount": 1000,  // Amount in cents (e.g., 1000 = R10.00)
        "currency": "zar"  // Optional, defaults to ZAR
    }
    """
    try:
        # Get data from request
        data = request.data
        amount = data.get('amount')
        currency = data.get('currency', 'zar')  # Default to South African Rand
        
        # Validate amount
        if not amount or amount <= 0:
            return Response({
                'error': 'Invalid amount. Amount must be greater than 0.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create a PaymentIntent with Stripe
        intent = stripe.PaymentIntent.create(
            amount=int(amount),  # Ensure amount is integer
            currency=currency,
            automatic_payment_methods={
                'enabled': True,
            },
            metadata={
                'integration_check': 'accept_a_payment',
            }
        )
        
        return Response({
            'clientSecret': intent.client_secret,
            'paymentIntentId': intent.id
        })
    
    except stripe.error.StripeError as e:
        # Handle Stripe-specific errors
        return Response({
            'error': f'Stripe error: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        # Handle other errors
        return Response({
            'error': f'Server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def confirm_payment(request):
    """
    Confirm payment and handle post-payment logic
    POST /api/confirm-payment/
    
    Expected request body:
    {
        "paymentIntentId": "pi_1234567890",
        "orderDetails": {...}  // Optional order details
    }
    """
    try:
        data = request.data
        payment_intent_id = data.get('paymentIntentId')
        
        if not payment_intent_id:
            return Response({
                'error': 'Payment Intent ID is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Retrieve the payment intent from Stripe
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        
        if intent.status == 'succeeded':
            # Payment was successful
            # Here you can add logic to:
            # - Create order in database
            # - Send confirmation email
            # - Update inventory
            # - etc.
            
            return Response({
                'success': True,
                'message': 'Payment confirmed successfully',
                'paymentStatus': intent.status
            })
        else:
            return Response({
                'success': False,
                'message': 'Payment not confirmed',
                'paymentStatus': intent.status
            }, status=status.HTTP_400_BAD_REQUEST)
    
    except stripe.error.StripeError as e:
        return Response({
            'error': f'Stripe error: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({
            'error': f'Server error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)