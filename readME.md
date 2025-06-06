# E-Commerce Application

A secure and scalable e-commerce application built with a FastAPI backend and React frontend, providing comprehensive features including product management, user authentication, order processing, and MPESA payment integration.

## Features

- **User Management**: Register and authenticate users (customers and admins).
- **Product Catalog**: Manage products with categories, filtering, and pagination.
- **Order Processing**: Create, update, and manage orders.
- **Payment Integration**: Seamless MPESA payment processing.
- **Search Functionality**: Search products by name.
- **Logging**: Detailed logging for debugging and monitoring.

## Technologies Used

- **FastAPI**: A modern web framework for building APIs with Python 3.6+ based on standard Python type hints.
- **SQLAlchemy**: ORM for database interactions.
- **MySQL**: Database for storing user and product data.
- **JWT**: JSON Web Tokens for secure user authentication.
- **Pydantic**: Data validation and settings management using Python type annotations.
- **FastAPI Mail**: For sending emails (e.g., password reset).
- **DARAJA API**: For payment processing.

## Installation

### Prerequisites

- Python 3.6 or higher
- MySQL Server
- Node.js (for any frontend or additional tooling)
- pip (Python package installer)

### Clone the Repository

```bash
git clone https://github.com/ericomondi/OnlineShopping.git
```

### Set Up the Backend

```bash
cd e-api
```

### Create a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Set Up Environment Variables

Create a `.env` file in the root directory and add the following variables:

```plaintext
DB_PASSWORD=your_database_password
JWT_SECRET_KEY=your_jwt_secret_key
MPESA_LNMO_CONSUMER_KEY=your_mpesa_consumer_key
MPESA_LNMO_CONSUMER_SECRET=your_mpesa_consumer_secret
MPESA_LNMO_INITIATOR_USERNAME=your_mpesa_initiator_username
MPESA_LNMO_INITIATOR_PASSWORD=your_mpesa_initiator_password
MPESA_LNMO_PASS_KEY=your_mpesa_pass_key
MPESA_LNMO_SHORT_CODE=your_mpesa_short_code
MPESA_CALLBACK_URL=your_mpesa_callback_url
```

### Database Setup

1. Create a MySQL database for your application.
2. Update the database connection URL in `database.py` if necessary.

### Set up the Frontend

```bash
cd e-commerce
```

### Install packages

```bash
npm install
```

## Running the Application

### Start the FastAPI Server

```bash
uvicorn main:app --reload
```

- The application will be running at `http://127.0.0.1:8000`.
- You can access the interactive API documentation at `http://127.0.0.1:8000/docs`.

## Usage

### API Endpoints

- **User Registration**: `POST /auth/register/customer` or `POST /auth/register/admin`
- **User Login**: `POST /auth/login`
- **Browse Products**: `GET /public/products`
- **Create Order**: `POST /create_order`
- **Payment Processing**: `POST /payments/lnmo/transact`

### Example Request

#### User Registration

```bash
curl -X POST "http://127.0.0.1:8000/auth/register/customer" \
-H "Content-Type: application/json" \
-d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'
```

## Testing

You can run tests using:

```bash
pytest
```

### Start the React Frontend

```bash
npm run dev
```

- The react app will be running at `http://127.0.0.1:5173`.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- FastAPI documentation and community for their support.
- The developers of the libraries and tools used in this project.

---

Feel free to modify any sections to better fit your project specifics, such as the repository link, environment variables, and any additional features or instructions you want to include.
