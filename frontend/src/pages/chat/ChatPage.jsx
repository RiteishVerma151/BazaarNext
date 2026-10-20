import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/commoncomponents/Navbar.jsx";
import Footer from "../../components/commoncomponents/Footer.jsx";
import ChatHeader from "../../components/chat/ChatHeader.jsx";
import MessageList from "../../components/chat/MessageList.jsx";
import MessageInput from "../../components/chat/MessageInput.jsx";
import useChat from "../../hooks/useChat.js";
import { useApp } from "../../context/AppContext.jsx";
import { PRODUCTS } from "../../data/products.js";
import { getSeller } from "../../data/sellers.js";
import styles from "../../styles/chat/ChatPage.module.css";

// Login ke bina testing karni ho toh isse false kar do.
const REQUIRE_LOGIN = true;

function ChatRoom({ product, userKey }) {
  const navigate = useNavigate();
  const seller = getSeller(product.id);
  const chat = useChat({ productId: product.id, userKey, price: product.price });

  return (
    <section className={styles.chat}>
      <ChatHeader product={product} seller={seller} />
      <MessageList
        messages={chat.messages}
        typing={chat.typing}
        sellerName={seller.name}
        agreed={chat.agreed}
        onRespond={chat.respondOffer}
        onCheckout={() => navigate(`/checkout/${product.id}`, { state: { price: chat.agreed.amount } })}
      />
      <MessageInput
        price={product.price}
        agreed={chat.agreed}
        hasPendingOffer={chat.hasPendingOffer}
        typing={chat.typing}
        showQuick={chat.messages.length === 0}
        onSendText={chat.sendText}
        onSendOffer={chat.sendOffer}
      />
    </section>
  );
}

export default function ChatPage() {
  const { productId } = useParams();
  const location = useLocation();
  const { currentUser, isAuthenticated, authLoading } = useApp();
  const product = PRODUCTS.find((p) => String(p.id) === productId);

  if (REQUIRE_LOGIN && authLoading) return null;
  if (REQUIRE_LOGIN && !isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  const userKey = currentUser?.id || currentUser?._id || currentUser?.email || "guest";

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.container}>
          {product ? (
            <ChatRoom key={`${userKey}-${product.id}`} product={product} userKey={userKey} />
          ) : (
            <div className={styles.notFound}>
              <h2>Product not found</h2>
              <p>This listing may have been removed.</p>
              <Link to="/products">Browse products</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}