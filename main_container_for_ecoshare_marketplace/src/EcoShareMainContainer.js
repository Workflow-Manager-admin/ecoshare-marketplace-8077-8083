import React, { useState } from "react";
import "./App.css";
import ListItemModal from "./ListItemModal";
import DetailsSidebarModal from "./DetailsSidebarModal";

/**
 * Placeholder mock data for user listings in EcoShare.
 */
const MOCK_LISTINGS = [
  {
    id: 1,
    title: "Gently Used Wooden Chair",
    description: "Strong, classic dining chair. No major scratches or stains.",
    price: 15,
    isDonation: false,
    postedBy: "Alice",
    category: "Furniture",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 2,
    title: "Children's Storybooks Collection",
    description: "A bundle of 8 bedtime favorites. Free to a good home!",
    isDonation: true,
    postedBy: "Ben",
    category: "Books",
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 3,
    title: "Kitchen Blender (Working)",
    description: "Just upgraded. Works perfectly and comes with all parts.",
    price: 10,
    isDonation: false,
    postedBy: "Charlie",
    category: "Appliances",
    img: "https://images.unsplash.com/photo-1519864600565-cb8ae3e161ae?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 4,
    title: "Warm Winter Jacket",
    description: "Men's Large. No rips, very warm. Available for donation.",
    isDonation: true,
    postedBy: "Diana",
    category: "Clothing",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=300&q=80"
  }
];

/**
 * Renders the main container for EcoShare.
 * Contains header, filters, listings, and "List an Item" with modal for submission.
 */
/**
 * PUBLIC_INTERFACE
 * EcoShareMainContainer - Main UI logic for listings in EcoShare.
 * Adds 'Buy' and 'Request' frontend-only actions with stylish confirmation feedback and state.
 */
function EcoShareMainContainer({ loggedInUser }) {
  // Internal state for the filter and listings (mock state)
  const [selectedTab, setSelectedTab] = useState("all");
  const [listings, setListings] = useState(
    // Initialize with status as undefined (not yet bought/requested)
    MOCK_LISTINGS.map((listing) => ({ ...listing, status: undefined }))
  );
  const [modalOpen, setModalOpen] = useState(false);

  // Details modal state
  const [detailsModal, setDetailsModal] = useState({
    open: false,
    mode: null,      // "buy" or "request"
    item: null,
  });

  // Local state for showing confirmation toasts (id, text, type)
  const [toast, setToast] = useState(null);

  // PUBLIC_INTERFACE
  function handleTabChange(tab) {
    setSelectedTab(tab);
  }

  // PUBLIC_INTERFACE
  function handleCreateListing() {
    setModalOpen(true);
  }

  // PUBLIC_INTERFACE
  function handleSubmitListing(listing) {
    setListings((prev) => [
      {
        ...listing,
        postedBy: loggedInUser?.name || "Anonymous",
        isDonation: !!listing.isDonation,
        status: undefined,
      },
      ...prev,
    ]);
  }

  // Handler for Buy (opens sidebar modal)
  // PUBLIC_INTERFACE
  function handleBuy(listing) {
    setDetailsModal({
      open: true,
      mode: "buy",
      item: listing,
    });
  }

  // Handler for Request (opens sidebar modal)
  // PUBLIC_INTERFACE
  function handleRequest(listing) {
    setDetailsModal({
      open: true,
      mode: "request",
      item: listing,
    });
  }

  // Handle details modal submit (update status, show toast, close sidebar)
  function handleDetailsSubmit({ id, mode }) {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status: mode === "buy" ? "Purchased" : "Requested",
            }
          : l
      )
    );
    setToast({
      type: "success",
      text:
        mode === "buy"
          ? "Item marked as Purchased! This is a frontend demo. (No real transaction sent.)"
          : "Request sent! This is a frontend demo. (No data sent to seller yet.)",
      key: `${id}_${mode}_${Date.now()}`,
    });
    setDetailsModal({ open: false, mode: null, item: null });
  }

  function closeDetailsModal() {
    setDetailsModal({ open: false, mode: null, item: null });
  }

  function closeToast() {
    setToast(null);
  }

  // PUBLIC_INTERFACE
  function getFilteredListings() {
    switch (selectedTab) {
      case "sale":
        return listings.filter((l) => !l.isDonation);
      case "donation":
        return listings.filter((l) => l.isDonation);
      case "my-listings":
        return loggedInUser
          ? listings.filter((l) => l.postedBy === loggedInUser.name)
          : [];
      case "all":
      default:
        return listings;
    }
  }

  function renderTabs() {
    return (
      <div className="eco-tabs">
        <button
          className={`eco-tab${selectedTab === "all" ? " active" : ""}`}
          onClick={() => handleTabChange("all")}
        >
          All
        </button>
        <button
          className={`eco-tab${selectedTab === "sale" ? " active" : ""}`}
          onClick={() => handleTabChange("sale")}
        >
          For Sale
        </button>
        <button
          className={`eco-tab${selectedTab === "donation" ? " active" : ""}`}
          onClick={() => handleTabChange("donation")}
        >
          Donation
        </button>
        <button
          className={`eco-tab${selectedTab === "my-listings" ? " active" : ""}`}
          onClick={() => handleTabChange("my-listings")}
          disabled={!loggedInUser}
          style={!loggedInUser ? { opacity: 0.55, cursor: "not-allowed" } : {}}
        >
          My Listings
        </button>
      </div>
    );
  }

  // Renders either Buy or Request button, disabled if already requested/purchased
  function renderActions(listing) {
    // If already requested/purchased, show inline message instead of button
    if (listing.status === "Purchased") {
      return (
        <div style={{
          marginTop: 9,
          fontWeight: 500,
          color: "var(--vivid-blue)",
          background: "#e9f3ff",
          borderRadius: 8,
          padding: "6px 12px",
          fontSize: "0.99em"
        }}>
          Purchased!
        </div>
      );
    }
    if (listing.status === "Requested") {
      return (
        <div style={{
          marginTop: 9,
          fontWeight: 500,
          color: "#20853b",
          background: "#edfae9",
          borderRadius: 8,
          padding: "6px 12px",
          fontSize: "0.99em"
        }}>
          Requested!
        </div>
      );
    }

    // Not yet performed: show prominent button
    if (!listing.isDonation) {
      // Buy for Sale items
      return (
        <button
          className="btn btn-small"
          style={{
            width: "100%",
            marginTop: 9
          }}
          onClick={() => handleBuy(listing.id)}
        >
          Buy
        </button>
      );
    } else {
      // Request for Donation items
      return (
        <button
          className="btn btn-small"
          style={{
            width: "100%",
            marginTop: 9
          }}
          onClick={() => handleRequest(listing.id)}
        >
          Request
        </button>
      );
    }
  }

  // UI for a single item card
  function renderListingCard(listing) {
    return (
      <div className="eco-card" key={listing.id}>
        <div className="eco-card-img-wrapper">
          <img className="eco-card-img" src={listing.img} alt={listing.title} />
          {listing.isDonation && (
            <div className="eco-card-badge">Donation</div>
          )}
          {!listing.isDonation && (
            <div className="eco-card-badge sale">For Sale</div>
          )}
        </div>
        <div className="eco-card-body">
          <div className="eco-card-title">{listing.title}</div>
          <div className="eco-card-description">
            {listing.description}
          </div>
          {!listing.isDonation && (
            <div className="eco-card-price">
              ${listing.price}
            </div>
          )}
          <div className="eco-card-postedby">
            <span>By {listing.postedBy}</span>
          </div>
          {/* Key buttons for buy/request */}
          {renderActions(listing)}
        </div>
      </div>
    );
  }

  function renderListingGrid(filtered) {
    if (filtered.length === 0)
      return (
        <div className="eco-empty-state">No items found in this category.</div>
      );
    return (
      <div className="eco-listing-grid">
        {filtered.map(renderListingCard)}
      </div>
    );
  }

  // Toast notification component (frontend-only confirmation)
  function Toast({ text, onClose, type }) {
    return (
      <div
        style={{
          position: "fixed",
          top: 24,
          left: "50%",
          transform: "translateX(-50%)",
          background: type === "success" ? "var(--vivid-blue)" : "#fff0d6",
          color: type === "success" ? "#fff" : "#222E",
          borderRadius: 17,
          fontWeight: 500,
          fontSize: 16.5,
          boxShadow: "0 3px 14px 0 rgba(52,65,134,0.16)",
          zIndex: 2009,
          padding: "15px 32px 15px 22px",
          display: "flex",
          alignItems: "center",
          minWidth: 210,
          maxWidth: "96vw",
          gap: 18,
        }}
        role="alert"
        onClick={onClose}
        tabIndex={0}
        aria-label="Close"
      >
        <span style={{ marginRight: 6 }}>
          {type === "success" ? "✅" : "ℹ️"}
        </span>
        {text}
        <button
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            color: "#fff",
            fontWeight: 700,
            fontSize: 20,
            cursor: "pointer",
            filter: "drop-shadow(0 2px 7px rgba(0,0,0,0.09))",
            padding: 0,
          }}
          title="Dismiss"
          aria-label="Dismiss"
          tabIndex={0}
          onClick={onClose}
        >
          ×
        </button>
      </div>
    );
  }

  // Auto-dismiss the toast after 2.5s
  React.useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 2500);
    return () => clearTimeout(timeout);
  }, [toast]);

  return (
    <div className="container eco-main">
      <div className="eco-main-header-row">
        <div>
          <h1 className="title" style={{ marginBottom: 4 }}>EcoShare</h1>
          <div className="description" style={{ marginTop: 2 }}>
            A community-powered platform to sell or donate used products.<br />
            Support <span style={{ color: 'var(--kavia-orange)' }}>sustainability</span> and connect with others seeking affordable, quality items.
          </div>
        </div>
        <button
          className="btn btn-large eco-create-btn"
          onClick={handleCreateListing}
          disabled={!loggedInUser}
          style={!loggedInUser
            ? { opacity: 0.55, cursor: "not-allowed" }
            : {}
          }
        >
          + List an Item
        </button>
      </div>
      {renderTabs()}
      <div style={{ marginTop: 32 }}>
        {renderListingGrid(getFilteredListings())}
      </div>
      <ListItemModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitListing}
      />
      {toast && (
        <Toast
          text={toast.text}
          type={toast.type}
          onClose={closeToast}
        />
      )}
      {/* Footer */}
      <footer className="eco-footer">
        <div>
          &copy; {new Date().getFullYear()} <span className="eco-footer-brand">EcoShare</span> &mdash; For Sustainability&nbsp;|&nbsp;<span className="eco-footer-platform">Kavia Platform</span>
        </div>
      </footer>
    </div>
  );
}

export default EcoShareMainContainer;
