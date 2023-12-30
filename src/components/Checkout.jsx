// Importación de módulos y componentes
import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, ListGroup, Col, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import * as CardValidator from "card-validator";

// Define un componente funcional llamado Checkout
const Checkout = ({ cart, setCart, simulatePurchase, onComplete }) => {
    // Define variables de estado usando el hook useState
    const [paymentMethod, setPaymentMethod] = useState("efectivo");
    const [email, setEmail] = useState("");
    const [cardType, setCardType] = useState("visa");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [securityCode, setSecurityCode] = useState("");
    const [street, setStreet] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [city, setCity] = useState("");
    const [cardHolder, setCardHolder] = useState("");

    // Función para manejar la compra según el método de pago seleccionado
    const handlePurchase = () => {
        // Verifica si el método de pago es 'efectivo' (efectivo)
        if (paymentMethod === "efectivo") {
            // Verifica si los campos requeridos están llenos para el pago en efectivo
            if (email && validateEmail(email) && street && postalCode && city) {
                // Simula la compra con pago en efectivo
                simulatePurchase({
                    method: "efectivo",
                    email,
                    address: { street, postalCode, city },
                    cart,
                });
                // Limpia el carrito y muestra una alerta de éxito
                setCart([]);
                showSuccessAlert();
                // Llama a la función de devolución onComplete
                onComplete();
            } else {
                // Muestra un error de validación si los campos requeridos no están llenos
                showValidationError(
                    "Por favor, completa la información de pago y dirección."
                );
            }
        } else if (paymentMethod === "tarjeta") {
            // Verifica si los campos requeridos están llenos para el pago con tarjeta
            if (validateCardInfo() && street && postalCode && city) {
                // Simula la compra con pago con tarjeta
                simulatePurchase({
                    method: "tarjeta",
                    cardType,
                    cardNumber,
                    expiryDate,
                    securityCode,
                    cardHolder,
                    address: { street, postalCode, city },
                    cart,
                });
                // Limpia el carrito y muestra una alerta de éxito
                setCart([]);
                showSuccessAlert();
                // Llama a la función de devolución onComplete
                onComplete();
            } else {
                // Muestra un error de validación si los campos requeridos no están llenos
                showValidationError(
                    "Por favor, completa la información de la tarjeta y dirección."
                );
            }
        }
    };

    // Función para mostrar una alerta de éxito
    const showSuccessAlert = () => {
        if (paymentMethod === "efectivo") {
            Swal.fire({
                icon: "success",
                title: "Compra Aprobada",
                text: `Se le enviará el comprobante de pago a ${email}. Tiene 72 horas para realizar el pago. Una vez acreditado, se le enviará el producto.`,
            });
        } else if (paymentMethod === "tarjeta") {
            Swal.fire({
                icon: "success",
                title: "Pago Aprobado",
                text: "En 48 horas se le enviará el producto.",
            });
        }
    };

    // Función para mostrar un error de validación
    const showValidationError = (message) => {
        let errorMessage = 'Error de Validación:\n' + message;

        Swal.fire({
            icon: 'error',
            title: 'Error de Validación',
            text: errorMessage,
        });
    };

    // Función para validar un correo electrónico
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Función para validar la información de la tarjeta de crédito
    const validateCardInfo = () => {
        const isAmex = cardType === "amex";
        return (
            cardNumber.length === (isAmex ? 18 : 19) &&
            expiryDate.length === 5 &&
            securityCode.length === (isAmex ? 4 : 3) &&
            street &&
            postalCode &&
            city
        );
    };

    // Función para calcular el total de un artículo en el carrito
    const calculateItemTotal = (item) => {
        return (item.product.price * item.quantity).toFixed(2);
    };

    // Función para obtener el tipo de tarjeta de crédito
    const getCardType = (cardNumber) => {
        const cardInfo = CardValidator.number(cardNumber);
        return cardInfo.card?.type || "unknown";
    };

    // Función para formatear el número de tarjeta de crédito
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const formatCardNumber = (cardNumber) => {
        const numArray = cardNumber.replace(/\D/g, '').split('');
        const cardType = getCardType(numArray.join(''));

        if (cardType === 'amex') {
            return numArray.reduce((acc, digit, index) => {
                if (index < 4) {
                    return acc + digit;
                } else if (index < 10) {
                    return acc + ' ' + digit;
                } else {
                    return acc + digit;
                }
            }, '');
        } else {
            return numArray.reduce((acc, digit, index) => {
                return acc + digit + (index > 0 && (index + 1) % 4 === 0 && index + 1 !== numArray.length ? ' ' : '');
            }, '');
        }
    };

    // Función para manejar el cambio en el titular de la tarjeta
    const handleCardHolderChange = useCallback((e) => {
        const inputValue = e.target.value.replace(/[^A-Za-z ]/g, "");
        setCardHolder(inputValue);
    }, []);

    // Función para manejar el cambio en el código de seguridad de la tarjeta
    const handleSecurityCodeChange = useCallback((e) => {
        const inputValue = e.target.value.replace(/\D/g, '');
        setSecurityCode(inputValue);
    }, []);

    // Función para manejar el cambio en la fecha de vencimiento de la tarjeta
    const handleExpiryDateChange = useCallback((e) => {
        const inputValue = e.target.value.replace(/\D/g, '');
        let formattedValue = inputValue;

        if (inputValue.length > 2) {
            formattedValue = `${inputValue.slice(0, 2)}/${inputValue.slice(2)}`;
        }

        setExpiryDate(formattedValue);
    }, []);

    // Función para manejar el cambio en el número de tarjeta de crédito
    const handleCardNumberChange = useCallback((e) => {
        const formattedNumber = formatCardNumber(e.target.value);
        setCardNumber(formattedNumber);
    }, [formatCardNumber]);

    // Función para manejar el cambio en el tipo de tarjeta
    const handleCardTypeChange = (e) => {
        const newCardType = e.target.value;

        // Verifica si el tipo de tarjeta ha cambiado
        if (newCardType !== cardType) {
            // Restablece todos los campos
            setCardNumber('');
            setExpiryDate('');
            setSecurityCode('');
            setCardHolder('');
            setStreet('');
            setPostalCode('');
            setCity('');
        }

        // Actualiza el tipo de tarjeta
        setCardType(newCardType);
    };

    // Función para verificar si todos los datos necesarios están completos
    const isDataComplete = () => {
        if (paymentMethod === 'efectivo') {
            // Verifica los campos requeridos para el pago en efectivo
            const requiredFields = ['email', 'street', 'postalCode', 'city'];

            for (const field of requiredFields) {
                if (!eval(field)) {
                    return false;
                }
            }
        } else if (paymentMethod === 'tarjeta') {
            // Verifica los campos requeridos para el pago con tarjeta
            const requiredFields = ['cardHolder', 'cardNumber', 'expiryDate', 'securityCode', 'street', 'postalCode', 'city'];

            for (const field of requiredFields) {
                if (!eval(field)) {
                    return false;
                }
            }
        }

        return true;
    };

    // Función para manejar la validación de datos antes de la compra
    const handleValidation = () => {
        if (isDataComplete()) {
            // Llama a la función handlePurchase después de la validación
            handlePurchase();
        } else {
            // Muestra un SweetAlert indicando que faltan completar datos
            showValidationError('Por favor, complete todos los campos requeridos');
        }
    };

     // Renderizado del componente
    return (
        <Modal show={true} onHide={onComplete} centered>
            <Modal.Header closeButton>
                <Modal.Title>Proceso de Compra</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <h5>Resumen de Compra:</h5>
                    <ListGroup variant="flush">
                        {cart.map((item) => (
                            <ListGroup.Item key={item.product.id}>
                                <Row>
                                    <Col xs={3} md={2}>
                                        <img
                                            src={item.product.image}
                                            alt={item.product.title}
                                            style={{ maxWidth: "100%", height: "auto" }}
                                        />
                                    </Col>
                                    <Col xs={9} md={10}>
                                        <div>
                                            <h6>{item.product.title}</h6>
                                            <p>Cantidad: {item.quantity}</p>
                                            <p>Importe Total: ${calculateItemTotal(item)}</p>
                                        </div>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                    <p className="mt-3">
                        Total a Pagar: $
                        {cart
                            .reduce(
                                (total, item) => total + item.product.price * item.quantity,
                                0
                            )
                            .toFixed(2)}
                    </p>
                </div>
                <Form>
                    <Form.Group controlId="formPaymentMethod">
                        <Form.Label>Método de Pago:</Form.Label>
                        <Form.Control
                            as="select"
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="efectivo">Efectivo</option>
                            <option value="tarjeta">Tarjeta de Crédito</option>
                        </Form.Control>
                    </Form.Group>

                    {paymentMethod === "efectivo" && (
                        <div>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email:</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Ingrese su correo electrónico"
                                    onChange={(e) => setEmail(e.target.value)}
                                    maxLength={50}
                                />
                            </Form.Group>
                            <Form.Group controlId="formStreet">
                                <Form.Label>Calle:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese su calle"
                                    onChange={(e) => setStreet(e.target.value)}
                                    maxLength={30}
                                />
                            </Form.Group>
                            <Form.Group controlId="formPostalCode">
                                <Form.Label>Código Postal:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese su código postal"
                                    onKeyPress={(e) => {
                                        // Permite solo números y limita la longitud a 4 caracteres
                                        const regex = /^[0-9]$/;
                                        const isValidInput = regex.test(e.key);

                                        if (!isValidInput || e.target.value.length >= 4) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        // Limita la longitud a 4 caracteres
                                        const inputValue = e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 4);
                                        setPostalCode(inputValue);
                                    }}
                                />
                            </Form.Group>
                            <Form.Group controlId="formCity">
                                <Form.Label>Localidad:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese su localidad"
                                    onChange={(e) => setCity(e.target.value)}
                                    maxLength={30}
                                />
                            </Form.Group>
                        </div>
                    )}

                    {paymentMethod === "tarjeta" && (
                        <div>
                            <Form.Group controlId="formCardType">
                                <Form.Label>Tipo de Tarjeta:</Form.Label>
                                <Form.Control
                                    as="select"
                                    onChange={handleCardTypeChange}
                                    value={cardType}
                                >
                                    <option value="visa">Visa</option>
                                    <option value="mastercard">Mastercard</option>
                                    <option value="bancaria">American Express Bancaria</option>
                                    <option value="amex">American Express</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formCardHolder">
                                <Form.Label>Nombre del Titular:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese el nombre del titular"
                                    onChange={handleCardHolderChange}
                                    onKeyPress={(e) => {
                                        const charCode = e.charCode;
                                        if (
                                            !(charCode >= 65 && charCode <= 90) &&
                                            !(charCode >= 97 && charCode <= 122) &&
                                            charCode !== 32
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    maxLength={30}
                                    value={cardHolder}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formCardNumber">
                                <Form.Label>Número de Tarjeta:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese el número de su tarjeta"
                                    onChange={handleCardNumberChange}
                                    minLength={cardType === "amex" ? 18 : 19}
                                    maxLength={cardType === "amex" ? 18 : 19}
                                    required
                                    value={cardNumber}
                                />
                            </Form.Group>
                            <Form.Group controlId="formExpiryDate">
                                <Form.Label>Fecha de Vencimiento:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="MM/YY"
                                    onChange={handleExpiryDateChange}
                                    maxLength={5}
                                    pattern="\d\d/\d\d"
                                    value={expiryDate}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formSecurityCode">
                                <Form.Label>Código de Seguridad:</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder={`Ingrese el código de seguridad (${cardType === "amex" ? 4 : 3
                                        } dígitos)`}
                                    onChange={handleSecurityCodeChange}
                                    minLength={cardType === "amex" ? 4 : 3}
                                    maxLength={cardType === "amex" ? 4 : 3}
                                    pattern="\d+"
                                    value={securityCode}
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="formStreet">
                                <Form.Label>Calle:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese su calle"
                                    onChange={(e) => setStreet(e.target.value)}
                                    maxLength={30}
                                />
                            </Form.Group>
                            <Form.Group controlId="formPostalCode">
                                <Form.Label>Código Postal:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese su código postal"
                                    onKeyPress={(e) => {
                                        // Permite solo números y limita la longitud a 4 caracteres
                                        const regex = /^[0-9]$/;
                                        const isValidInput = regex.test(e.key);

                                        if (!isValidInput || e.target.value.length >= 4) {
                                            e.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        // Limita la longitud a 4 caracteres
                                        const inputValue = e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 4);
                                        setPostalCode(inputValue);
                                    }}
                                />
                            </Form.Group>
                            <Form.Group controlId="formCity">
                                <Form.Label>Localidad:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese su localidad"
                                    onChange={(e) => setCity(e.target.value)}
                                    maxLength={30}
                                />
                            </Form.Group>
                        </div>
                    )}
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="btn btn-success" onClick={handleValidation}>
                    Comprar
                </Button>
                <Button variant="secondary" onClick={onComplete}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

// Definición de los tipos de propiedades esperadas por el componente
Checkout.propTypes = {
    cart: PropTypes.array.isRequired, // Contenido del carrito
    setCart: PropTypes.func.isRequired, // Función para actualizar el contenido del carrito
    simulatePurchase: PropTypes.func.isRequired, // Función para simular la compra
    onComplete: PropTypes.func.isRequired, // Función que se ejecuta al completar la compra
};

// Exportar el componente Checkout como componente por defecto
export default Checkout;

