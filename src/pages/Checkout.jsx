import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GooglePayButton from '@google-pay/button-react';
import countryData from 'country-list/data.json';
import { CreditCard, HandCoins, ShoppingCart, Truck, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { clearCart } from '../store/cart';
import { PhoneInput } from "react-international-phone"
import "react-international-phone/style.css"
import { loadStripe } from '@stripe/stripe-js'
import { createOrder, simulatePayment } from '../services/api';

const PAYPAL_SUPPORTED_CODES = new Set([
    'AL', 'DZ', 'AD', 'AO', 'AI', 'AR', 'AM', 'AU', 'AT', 'AZ', 'BS', 'BH', 'BD', 'BB', 'BE', 'BZ',
    'BJ', 'BT', 'BO', 'BA', 'BW', 'BR', 'VG', 'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY',
    'CF', 'TD', 'CL', 'CN', 'CO', 'KM', 'CG', 'CK', 'CR', 'HR', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO',
    'EC', 'SV', 'ER', 'EE', 'ET', 'FK', 'FJ', 'FI', 'FR', 'GF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI',
    'GR', 'GL', 'GD', 'GP', 'GT', 'GN', 'GW', 'GY', 'HT', 'HN', 'HK', 'HU', 'IS', 'IN', 'ID', 'IE',
    'IL', 'IT', 'JM', 'JP', 'JO', 'KZ', 'KE', 'KI', 'XK', 'KW', 'KG', 'LA', 'LV', 'LS', 'LR', 'LI',
    'LT', 'LU', 'MO', 'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT', 'MX', 'FM',
    'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'NA', 'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG',
    'NU', 'NF', 'MK', 'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PL', 'PT', 'PR',
    'QA', 'RO', 'RU', 'RW', 'KN', 'LC', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC', 'SL', 'SG',
    'SK', 'SI', 'SB', 'SO', 'ZA', 'KR', 'ES', 'LK', 'SR', 'SE', 'CH', 'TW', 'TJ', 'TZ', 'TH', 'TL',
    'TG', 'TO', 'TT', 'TN', 'TR', 'TM', 'TV', 'UG', 'UA', 'AE', 'GB', 'US', 'UY', 'UZ', 'VU', 'VE',
    'VN', 'WF', 'YE', 'ZM', 'ZW'
]);


const PAYPAL_COUNTRIES = countryData.filter(c => PAYPAL_SUPPORTED_CODES.has(c.code));





// ─── Shared Shipping Details Form ─────────────────────────────────────────────
const ShippingDetails = ({ phone, setPhone, shippingInfo, setShippingInfo }) => (
    <div className="mt-6 border-t border-gray-200 pt-5 space-y-3">
        <div className="flex items-center gap-2 mb-2">
            <Truck size={16} className="text-gray-500" />
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Shipping Details</h3>
        </div>
        {/* Country – Kenya only */}
        <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Country</label>
            <select className="w-full bg-white/70 border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all">
                <option value="kenya">Kenya</option>
            </select>
        </div>
        {/* Full Name */}
        <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
            <input
                type="text"
                placeholder="e.g. John Otieno"
                value={shippingInfo.fullName}
                onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                required
                className="w-full bg-white/70 border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
            />
        </div>
        {/* Address */}
        <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Address</label>
            <input
                type="text"
                placeholder="Street address"
                value={shippingInfo.address}
                onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                required
                className="w-full bg-white/70 border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
            />
        </div>
        {/* City & Postal Code */}
        <div className="grid grid-cols-2 gap-3">
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
                <input
                    type="text"
                    placeholder="Nairobi"
                    value={shippingInfo.city}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                    required
                    className="w-full bg-white/70 border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Postal Code</label>
                <input
                    type="text"
                    placeholder="00100"
                    value={shippingInfo.zipCode}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                    required
                    className="w-full bg-white/70 border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                />
            </div>
        </div>
        {/* Phone with country code */}
        <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
            <div className="flex gap-2">
                <PhoneInput
                    id="phoneInput"
                    defaultCountry="KE"
                    value={phone}
                    onChange={setPhone}
                    className={`d-flex form-control`}
                    placeholder="Enter Phone Number"

                >

                </PhoneInput>
            </div>
        </div>
    </div>
);

// ─── Delivery Fee Row ──────────────────────────────────────────────────────────
const DELIVERY_FEE = 0;

const PriceSummaryRows = ({ subtotal, discount, total }) => (
    <div className="mt-4 pt-4 border-t border-gray-200 space-y-1.5 text-sm">
        <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium text-gray-800">KSH {subtotal.toLocaleString()}</span>
        </div>
        {discount > 0 && (
            <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span className="font-medium text-red-500">- KSH {discount.toLocaleString()}</span>
            </div>
        )}
        <div className="flex justify-between text-gray-600">
            <span className="flex items-center gap-1"><Truck size={14} /> Delivery Fee</span>
            <span className="font-medium text-gray-800">KSH {DELIVERY_FEE.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
            <span>Total</span>
            <span>KSH {total.toLocaleString()}</span>
        </div>
    </div>
);

const Checkout = () => {
    const { items, isAuthenticated } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('mpesa');
    const [phone, setPhone] = useState('')
    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        address: '',
        city: '',
        zipCode: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);


    React.useEffect(() => {
        if (!isAuthenticated) navigate('/');
    }, [isAuthenticated, navigate]);

    const subtotal = items.reduce((sum, item) => sum + ((item.originalPrice || item.price || 0) * (item.quantity || 1)), 0);
    const totalDiscount = items.reduce((sum, item) => sum + (((item.originalPrice || item.price || 0) - (item.price || 0)) * (item.quantity || 1)), 0);
    const grandTotal = subtotal - totalDiscount + DELIVERY_FEE;

    const handlePurchase = async () => {
        if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || !phone) {
            alert("Please fill in all required shipping details.");
            return;
        }

        try {
            setIsSubmitting(true);
            // 1. Create Order
            const orderResponse = await createOrder({
                items: items,
                total_amount: grandTotal,
                payment_method: activeTab,
                shipping_details: {
                    ...shippingInfo,
                    phone: phone
                }
            });

            if (orderResponse.status === 'success') {
                const orderId = orderResponse.data.orderId;

                // 2. Simulate Payment (Since real methods are not yet initiated)
                const paymentResponse = await simulatePayment({
                    orderId: orderId,
                    simulate_status: 'successful'
                });

                if (paymentResponse.status === 'success') {
                    setOrderSuccess(orderId);
                    dispatch(clearCart());
                } else {
                    alert("Payment simulation failed.");
                }
            }
        } catch (err) {
            console.error("Purchase error:", err);
            alert("Failed to process purchase. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="container mx-auto px-4 py-32 min-h-screen flex flex-col items-center justify-center text-center">
                <CheckCircle2 size={80} className="text-green-500 mb-6" />
                <h1 className="text-4xl font-zentry font-bold text-gray-900 mb-4 uppercase">Purchase Successful!</h1>
                <p className="text-gray-600 mb-8 max-w-md">
                    Thank you for your purchase. Your order ID is <span className="font-bold text-black">#{orderSuccess}</span>.
                    You will receive a confirmation message shortly.
                </p>
                <button
                    onClick={() => navigate('/merch')}
                    className="px-10 py-4 bg-black text-white rounded-2xl font-bold hover:bg-neutral-800 transition-all uppercase tracking-widest text-sm"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    const tabButtonClass = (tab, activeColor) =>
        `px-1 py-1 rounded-sm border transition-all hover:cursor-pointer ${activeTab === tab ? `${activeColor} border-transparent` : 'border-black/10 bg-white/50'
        }`;

    return (
        <div className="container mx-auto px-4 py-32 min-h-screen">
            <h1 className="text-4xl font-zentry font-bold text-gray-900 mb-8 uppercase text-center">Checkout</h1>

            {items.length === 0 ? (
                <div className="text-center text-gray-500 py-12 bg-white/50 backdrop-blur-md rounded-2xl shadow-sm border border-black/5">
                    <p>Your cart is empty. Please add items before checking out.</p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="mt-6 px-8 py-3 bg-black text-white rounded-2xl font-bold hover:bg-neutral-800 transition-colors"
                    >
                        Return to Shop
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="bg-white/50 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-black/5 self-start">
                        <h2 className="text-2xl font-bold mb-6 font-zentry uppercase">Order Summary</h2>

                        <div className="space-y-3">
                            {items.map((item, index) => (
                                <div key={index} className="flex items-center gap-3 border-b border-gray-100 pb-3">
                                    <img
                                        src={item.image || 'https://via.placeholder.com/150'}
                                        alt={item.name}
                                        className="w-14 h-14 object-cover rounded-xl flex-shrink-0 border border-gray-200"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500">
                                            Qty: {item.quantity}
                                            {(item.size || item.color) && (
                                                <span className="ml-2">
                                                    ({item.size && <span>Size: {item.size}</span>}
                                                    {item.size && item.color && <span className="mx-1">|</span>}
                                                    {item.color && <span>Color: {item.color}</span>})
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                    <span className="text-sm font-bold text-gray-800 flex-shrink-0">
                                        KSH {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <PriceSummaryRows subtotal={subtotal} discount={totalDiscount} total={grandTotal} />
                    </div>

                    {/* ── Payment Method Card ───────────────────────────────────────── */}
                    <div className="bg-white/50 backdrop-blur-md p-8 rounded-[2rem] shadow-lg border border-black/5 self-start">

                        {/* Tab selector */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-5 font-zentry uppercase">Payment Method</h2>
                            <div className="flex items-center gap-3">
                                {/* Credit Card */}
                                <button
                                    onClick={() => setActiveTab('credit')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
                    ${activeTab === 'credit' ? 'bg-blue-600 text-white' : 'bg-white/70 border border-black/10 text-gray-700'}`}
                                >
                                    <CreditCard size={18} />
                                    Credit Card
                                </button>
                                {/* PayPal */}
                                <button onClick={() => setActiveTab('paypal')} className={tabButtonClass('paypal', 'bg-blue-600')}>
                                    <img src="/img/paypal.png" className="w-10 h-10 object-contain" alt="PayPal" />
                                </button>
                                {/* M-Pesa */}
                                <button onClick={() => setActiveTab('mpesa')} className={tabButtonClass('mpesa', 'bg-green-600')}>
                                    <img src="/img/mpesa.png" className="w-10 h-10 object-contain" alt="M-Pesa" />
                                </button>
                                {/* Google Pay */}
                                <button onClick={() => setActiveTab('google')} className={tabButtonClass('google', 'bg-orange-600')}>
                                    <img src="/img/google.png" className="w-10 h-10 object-contain" alt="Google Pay" />
                                </button>
                            </div>
                        </div>

                        {/* ── CREDIT CARD TAB ────────────────────────────────────────── */}
                        {activeTab === 'credit' && (
                            <div>
                                <form className="space-y-4 text-sm">
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1.5">Card Number</label>
                                        <input
                                            type="text"

                                            placeholder="3721 8456 9012 XXXX"
                                            inputMode="numeric"
                                            pattern="[0-9 ]{13,19}"
                                            maxLength={19}
                                            required
                                            className="w-full bg-white/70 border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-black outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-semibold mb-1.5">Cardholder Name</label>
                                        <input
                                            type="text"
                                            pattern="[A-Za-z ]{3,40}"
                                            maxLength={40}
                                            required
                                            className="w-full bg-white/70 border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-black outline-none transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-1.5">Expiry Date</label>
                                            <input
                                                type="text"
                                                placeholder="MM/YY"
                                                pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                                                maxLength={5}
                                                required
                                                className="w-full bg-white/70 border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-black outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-1.5">CVV</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    placeholder="CVV"
                                                    inputMode="numeric"
                                                    pattern="[0-9]{3}"
                                                    maxLength={3}
                                                    required
                                                    className="w-20 bg-white/70 border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-black outline-none transition-all"
                                                />
                                                <img src="/img/visa.svg" className="w-10 h-10" alt="Visa" />
                                                <img src="/img/mastercard.png" className="w-10 h-7" alt="Mastercard" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" className="w-4 h-4 rounded-full hover:cursor-pointer" id="save" />
                                        <label htmlFor="save" className="text-sm font-semibold text-orange-600">Save card information</label>
                                    </div>
                                </form>
                                <ShippingDetails phone={phone} setPhone={setPhone} shippingInfo={shippingInfo} setShippingInfo={setShippingInfo} />
                                <PriceSummaryRows subtotal={subtotal} discount={totalDiscount} total={grandTotal} />

                                <button
                                    onClick={handlePurchase}
                                    disabled={isSubmitting}
                                    className="mt-4 w-full flex items-center justify-center gap-2 px-2 py-4 font-zentry uppercase text-xl bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Checkout'}
                                </button>
                            </div>
                        )}

                        {/* ── PAYPAL TAB ─────────────────────────────────────────────── */}
                        {activeTab === 'paypal' && (
                            <div>
                                <div className="flex justify-between items-center px-2 mb-3">
                                    <img src="/img/paypallogo.png" alt="PayPal logo" className="w-28 h-20 object-contain" />
                                    <div className="flex items-center gap-3">
                                        <ShoppingCart size={20} />
                                        <span className="text-gray-800 text-lg font-bold">KSH {grandTotal.toLocaleString()}</span>
                                    </div>
                                </div>

                                <h2 className="text-center font-barlow text-3xl font-bold">Pay with PayPal</h2>
                                <p className="text-center font-barlow leading-tight mt-1 text-base text-gray-400">
                                    Enter your credentials to finish payment <br />
                                    We don't share your financial details with the merchant
                                </p>

                                {/* Country selector */}
                                <div className="mt-4">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Select Country</label>
                                    <select
                                        name="country" id="paypal-country"
                                        className="w-full bg-white/70 border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all"
                                    >
                                        {PAYPAL_COUNTRIES.map((c) => (
                                            <option key={c.code} value={c.code}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-6 px-2 py-3">
                                    <img src="/img/mastercard.png" className="w-14 h-10 object-contain" alt="Mastercard" />
                                    <img src="/img/visa.svg" className="w-14 h-10 object-contain" alt="Visa" />
                                    <img src="/img/AMEX.svg" className="w-14 h-10 rounded-sm object-contain" alt="Amex" />
                                </div>

                                <form className="space-y-3 text-sm">
                                    <input type="text" placeholder="Card Number"
                                        className="w-full bg-white/70 border border-gray-300 rounded-xl py-3 px-4 focus:ring-2 focus:ring-black outline-none transition-all" required />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="text" placeholder="MM/YY"
                                            className="bg-white/70 border border-gray-300 rounded-sm py-3 px-4 focus:ring-2 focus:ring-black outline-none transition-all" required />
                                        <input type="text" placeholder="CVV"
                                            className="bg-white/70 border border-gray-300 rounded-sm py-3 px-4 focus:ring-2 focus:ring-black outline-none transition-all" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input type="text" placeholder="First name"
                                            className="bg-white/70 border border-gray-300 rounded-sm py-3 px-4 focus:ring-2 focus:ring-black outline-none transition-all" required />
                                        <input type="text" placeholder="Last name"
                                            className="bg-white/70 border border-gray-300 rounded-sm py-3 px-4 focus:ring-2 focus:ring-black outline-none transition-all" required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <select className="font-barlow text-sm bg-white/70 border py-3 px-4 border-gray-300 rounded-sm focus:ring-2 focus:ring-black outline-none transition-all" required>
                                            <option>Device</option>
                                            <option value="mobile">Mobile</option>
                                            <option value="tablet">Tablet</option>
                                            <option value="desktop">Desktop</option>
                                        </select>
                                        <input type="text" placeholder="Phone number"
                                            className="bg-white/70 border border-gray-300 rounded-sm py-3 px-4 focus:ring-2 focus:ring-black outline-none transition-all" required />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-black pt-1 text-base font-barlow">Billing address</h3>
                                        <input type="text" placeholder="Address line 1"
                                            className="w-full bg-white/70 border border-gray-300 rounded-sm py-3 px-4 focus:ring-2 focus:ring-black outline-none transition-all" />
                                        <input type="text" placeholder="Address line 2"
                                            className="w-full bg-white/70 border border-gray-300 rounded-sm py-3 px-4 focus:ring-2 focus:ring-black outline-none transition-all" />
                                        <input type="text" placeholder="PostCode"
                                            className="w-full bg-white/70 border border-gray-300 rounded-sm py-3 px-4 focus:ring-2 focus:ring-black outline-none transition-all" />
                                        <input type="text" placeholder="City / Town / Village"
                                            className="w-full bg-white/70 border border-gray-300 rounded-sm py-3 px-4 focus:ring-2 focus:ring-black outline-none transition-all" />
                                    </div>
                                </form>

                                {/* Shipping */}
                                <ShippingDetails phone={phone} setPhone={setPhone} shippingInfo={shippingInfo} setShippingInfo={setShippingInfo} />

                                {/* Price summary */}
                                <PriceSummaryRows subtotal={subtotal} discount={totalDiscount} total={grandTotal} />

                                <button
                                    onClick={handlePurchase}
                                    disabled={isSubmitting}
                                    className="mt-4 w-full flex items-center justify-center gap-2 px-2 py-4 font-zentry uppercase text-2xl bg-yellow-400 rounded-4xl hover:bg-yellow-300 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin text-blue-800" /> : (
                                        <>
                                            <span className="text-blue-800 uppercase">Check</span><span className=" uppercase text-blue-600">out</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* ── M-PESA TAB ─────────────────────────────────────────────── */}
                        {activeTab === 'mpesa' && (
                            <div className="px-2 py-2 text-center space-y-3">
                                <img src="/img/mpesapay.png" className="h-full w-full rounded-sm" alt="Lipa Na M-Pesa" />
                                <h3 className="font-barlow text-3xl font-black">M-PESA Payment</h3>
                                <p className="font-barlow text-base text-gray-600">Please complete payment for:</p>

                                {/* Cart Items list */}
                                <ul className="text-left text-sm space-y-2 bg-gray-50 rounded-xl p-3">
                                    {items.map((item, index) => {
                                        const lineTotal = (item.price || 0) * (item.quantity || 1);
                                        return (
                                            <li key={index} className="flex items-center justify-between gap-2 border-b border-gray-100 pb-1 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-2">
                                                    <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-8 h-8 rounded-md object-cover border border-gray-200" />
                                                    <div className="flex flex-col text-left">
                                                        <span className="font-medium text-gray-700">{item.name} <span className="text-gray-400">x{item.quantity}</span></span>
                                                        {(item.size || item.color) && (
                                                            <span className="text-xs text-gray-500">
                                                                {item.size && <span>Size: {item.size}</span>}
                                                                {item.size && item.color && <span className="mx-1">|</span>}
                                                                {item.color && <span>Color: {item.color}</span>}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="font-semibold text-gray-800">KSH {lineTotal.toLocaleString()}</span>
                                            </li>
                                        );
                                    })}
                                </ul>

                                <p className="font-barlow text-lg text-blue-600 leading-relaxed font-black">
                                    TOTAL : KSH {grandTotal.toLocaleString()} <br />
                                    <span className="text-sm font-normal text-gray-500">(incl. KSH {DELIVERY_FEE} delivery)</span><br />
                                    To URBANVILLE SPORTS COMMUNITY BASED ORGANISATION <br />
                                    PAYBILL : 40200 <br />
                                    ACCOUNT : 848106
                                </p>

                                <input type="text" placeholder="Phone number e.g. 0712 345 678"
                                    className="w-full bg-white/70 border border-gray-300 rounded-sm py-3 px-4 text-sm focus:ring-2 focus:ring-black outline-none transition-all" required />

                                {/* Shipping */}
                                <ShippingDetails phone={phone} setPhone={setPhone} shippingInfo={shippingInfo} setShippingInfo={setShippingInfo} />

                                <button
                                    onClick={handlePurchase}
                                    disabled={isSubmitting}
                                    className="flex items-center hover:cursor-pointer gap-3 justify-center w-full px-2 py-4 font-zentry uppercase text-xl bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
                                >
                                    {isSubmitting ? <Loader2 className="animate-spin" /> : <><HandCoins /> Complete Payment</>}
                                </button>
                            </div>
                        )}

                        {/* ── GOOGLE PAY TAB ─────────────────────────────────────────── */}
                        {activeTab === 'google' && (
                            <div className="space-y-4 text-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <img src="/img/google.png" className="w-10 h-10 object-contain" alt="Google Pay" />
                                    <div>
                                        <h3 className="font-bold text-lg">Google Pay</h3>
                                        <p className="text-gray-500 text-xs">Fast, secure checkout with Google</p>
                                    </div>
                                    <div className="ml-auto font-bold text-gray-800 text-base">KSH {grandTotal.toLocaleString()}</div>
                                </div>

                                {/* Google Pay shipping details (country: Kenya only) */}
                                <div className="bg-gray-50/70 rounded-xl p-4 space-y-3 border border-gray-200">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin size={15} className="text-gray-500" />
                                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Shipping Information</h4>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Country</label>
                                        <select className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all">
                                            <option value="kenya">🇰🇪 Kenya</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                                        <input type="text" placeholder="First and last name"
                                            className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all" required />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Company <span className="text-gray-400 font-normal">(optional)</span></label>
                                        <input type="text" placeholder="Company or organization"
                                            className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all" />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Address</label>
                                        <input type="text" placeholder="Street address"
                                            className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all" required />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
                                            <input type="text" placeholder="Nairobi"
                                                className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Postal Code</label>
                                            <input type="text" placeholder="00100"
                                                className="w-full bg-white border border-gray-300 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-black outline-none transition-all" required />
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <PhoneInput
                                            id="phoneInput"
                                            defaultCountry="KE"
                                            value={phone}
                                            onChange={setPhone}
                                            className={`d-flex form-control`}
                                            placeholder="Enter Phone Number"

                                        >

                                        </PhoneInput>

                                    </div>
                                </div>

                                {/* Price summary */}
                                <PriceSummaryRows subtotal={subtotal} discount={totalDiscount} total={grandTotal} />

                                {/* Centered Google Pay button */}
                                <div className="mt-4 flex justify-center">
                                    <GooglePayButton
                                        buttonSizeMode='fill'
                                        style={{ width: '100%' }}
                                        paymentRequest={{
                                            apiVersion: 2,
                                            apiVersionMinor: 0,
                                            allowedPaymentMethods: [
                                                {
                                                    type: 'CARD',
                                                    parameters: {
                                                        allowedAuthMethods: ['CRYPTOGRAM_3DS', 'PAN_ONLY'],
                                                        allowedCardNetworks: ['MASTERCARD', 'AMEX', 'VISA']
                                                    },
                                                    tokenizationSpecification: {
                                                        type: 'PAYMENT_GATEWAY',
                                                        parameters: {
                                                            gateway: 'example',
                                                            gatewayMerchantId: 'exampleMerchID'
                                                        }
                                                    }
                                                }
                                            ],
                                            merchantInfo: {
                                                merchantName: 'Urbanville Sports'
                                            },
                                            transactionInfo: {
                                                totalPriceStatus: 'FINAL',
                                                totalPriceLabel: 'Total',
                                                totalPrice: grandTotal.toFixed(2),
                                                countryCode: 'KE',
                                                currencyCode: 'KES'
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
