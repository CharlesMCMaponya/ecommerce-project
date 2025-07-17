# MCPECULIAR E-commerce Platform

MCPECULIAR is a full-featured e-commerce platform built with Django and React. It provides everything you need for a complete online shopping experience - from browsing products to secure checkout and order tracking.

## What You Get

The platform comes with essential e-commerce features like product catalogs with categories and search functionality. Users can add items to their cart, complete secure purchases through Stripe integration, and track their orders. There's also a complete user account system with profiles and order history.

Beyond the basics, you get product reviews and ratings, wishlist functionality, email notifications for order updates, an admin dashboard for managing everything, newsletter subscriptions, and shipping management.

## The Technology Behind It

The backend runs on Django with Django REST Framework for API development. PostgreSQL handles the database, Stripe processes payments, and Celery manages email tasks with Redis as the broker and cache.

The frontend is built with React and React Router for navigation. Redux manages the application state, Bootstrap handles the UI components, and Axios manages HTTP requests. Stripe.js handles the payment integration on the client side.

For deployment, everything is containerized with Docker, uses GitHub Actions for CI/CD, Nginx as the web server, Gunicorn as the WSGI server, and can be hosted on AWS.

## Getting Started

Before you begin, make sure you have Python 3.9 or higher, Node.js 16 or higher, PostgreSQL, Redis, and a Stripe account set up.

**Setting up the Backend**

Start by cloning the repository:
```bash
git clone https://github.com/CharlesMCMaponya/ecommerce-project.git
cd ecommerce-project/backend
```

Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate    # Windows
```

Install the required dependencies:
```bash
pip install -r requirements.txt
```

Set up your environment variables by copying the example file:
```bash
cp .env.example .env
```

You'll need to edit the .env file with your specific configuration details.

Apply the database migrations:
```bash
python manage.py migrate
```

Create a superuser account:
```bash
python manage.py createsuperuser
```

Start the development server:
```bash
python manage.py runserver
```

**Setting up the Frontend**

Navigate to the frontend directory:
```bash
cd ../frontend
```

Install the dependencies:
```bash
npm install
```

Start the development server:
```bash
npm start
```

**Production Setup with Docker**

For production deployment, build and start the containers:
```bash
docker-compose up --build -d
```

Apply migrations in the container:
```bash
docker-compose exec backend python manage.py migrate
```

Collect static files:
```bash
docker-compose exec backend python manage.py collectstatic --no-input
```

## Configuration

You'll need to create a .env file in the backend directory with your specific settings:

```env
# Django Settings
DEBUG=False
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=ecommerce
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=db
DB_PORT=5432

# Stripe
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=your-sendgrid-key
DEFAULT_FROM_EMAIL=contact@mcpeculiar.com

# Redis
REDIS_URL=redis://redis:6379/0
```

For Stripe webhooks, you'll need to set up these endpoints in your Stripe dashboard: payment_intent.succeeded, payment_intent.payment_failed, and checkout.session.completed.

## How It Works

Customers can browse products and categories, add items to their cart and wishlist, complete purchases, track orders, and write reviews. Administrators can manage products and categories, process orders and update statuses, view sales reports, and manage users.

The platform runs on these key endpoints:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/
- Admin Panel: http://localhost:8000/admin/
- API Documentation: http://localhost:8000/swagger/

## License

All Rights Reserved. Copyright (c) 2025 Charles Mosehla.

This software is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.

## Contact

For support or questions about the project, reach out to Charles Mosehla at charlesMosehla@outlook.com or check out the project repository at https://github.com/CharlesMCMaponya/ecommerce-project.
