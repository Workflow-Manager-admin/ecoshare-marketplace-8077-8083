import React, { useState } from "react";
import "./App.css";

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
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 2,
    title: "Children's Storybooks Collection",
    description: "A bundle of 8 bedtime favorites. Free to a good home!",
    isDonation: true,
    postedBy: "Ben",
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 3,
    title: "Kitchen Blender (Working)",
    description: "Just upgraded. Works perfectly and comes with all parts.",
    price: 10,
    isDonation: false,
    postedBy: "Charlie",
    img: "https://images.unsplash.com/photo-1519864600565-cb8ae3e161ae?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: 4,
    title: "Warm Winter Jacket",
    description: "Men's Large. No rips, very warm. Available for donation.",
    isDonation: true,
    postedBy: "Diana",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=300&q=80"
  }
];

/**
 * Renders the main container for EcoShare.
 * Contains header, filters, listings, and placeholder interactivity for listing, sale, and donation.
 */
// PUBLIC_INTERFACE
function EcoShareMainContainer() {
  // Internal state for the filter and listings (mock state)
  const [selectedTab, setSelectedTab] = useState("all"); // 'all', 'sale', 'donation', 'my-listings'
  const [listings, setListings] = useState(MOCK_LISTINGS);
  // Placeholder "logged-in user" for demo purposes
  const user = { name: "Alice" };

  /**
   * Handler for the tab/filter selection.
   */
  // PUBLIC_INTERFACE
  function handleTabChange(tab) {
    setSelectedTab(tab);
  }

  /**
   * Handler for creating a new listing (opens modal in full app; here just alerts).
   */
  // PUBLIC_INTERFACE
  function handleCreateListing() {
    // In a full version, open a creation modal or page.
    window.alert("Placeholder: Open create listing modal.");
  }

  /**
   * Filters listings according to the selected tab.
   */
  // PUBLIC_INTERFACE
  function getFilteredListings() {
    switch (selectedTab) {
      case "sale":
        return listings.filter((l) => !l.isDonation);
      case "donation":
        return listings.filter((l) => l.isDonation);
      case "my-listings":
        return listings.filter((l) => l.postedBy === user.name);
      case "all":
      default:
        return listings;
    }
  }

  // UI for the tab filters
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
        >
          My Listings
        </button>
      </div>
    );
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
          {/* Placeholder buttons for interacting with items */}
          {!listing.isDonation ? (
            <button
              className="btn btn-small"
              onClick={() =>
                window.alert("Placeholder: Purchase flow for " + listing.title)
              }
            >
              Buy
            </button>
          ) : (
            <button
              className="btn btn-small"
              onClick={() =>
                window.alert(
                  "Placeholder: Request for donation—" + listing.title
                )
              }
            >
              Request
            </button>
          )}
        </div>
      </div>
    );
  }

  // Listing grid UI
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

    // Main container UI
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
        {/* Listing button */}
        <button
          className="btn btn-large eco-create-btn"
          onClick={handleCreateListing}
        >
          + List an Item
        </button>
      </div>
      {renderTabs()}
      <div style={{ marginTop: 32 }}>
        {renderListingGrid(getFilteredListings())}
      </div>
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
