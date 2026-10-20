import { Link } from "react-router-dom";
import styles from "../../styles/salesReport/CustomerReviews.module.css";

const REVIEW_SUMMARY = {
  avgRating: 4.7,
  totalReviews: 12,
  breakdown: { 5: 8, 4: 3, 3: 1, 2: 0, 1: 0 },
  recentReviews: [
    { id: 1, reviewer: "Amit K.", initials: "AK", rating: 5, comment: "Excellent condition, exactly as described. Quick handover!", date: "Oct 18" },
    { id: 2, reviewer: "Priya S.", initials: "PS", rating: 4, comment: "Cycle is in good condition. Minor scratch but works perfectly.", date: "Oct 15" },
    { id: 3, reviewer: "Rahul M.", initials: "RM", rating: 5, comment: "Table is sturdy and well maintained. Great value!", date: "Oct 10" },
  ],
};

function Stars({ rating, size = 14 }) {
  return (
    <div className={styles.stars}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i <= rating ? "var(--warning, #f5a623)" : "none"}
          stroke="var(--warning, #f5a623)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
}

export default function CustomerReviews() {
  return (
    <div className={styles.reviewsCard}>
      <div className={styles.cardHeader}>
        <div>
          <h2>Customer Reviews</h2>
          <p>What buyers are saying about you</p>
        </div>
        <Link to="/reviews" className={styles.viewAll}>
          View all reviews →
        </Link>
      </div>

      <div className={styles.reviewsGrid}>
        {/* Left: Rating Summary */}
        <div className={styles.ratingSummary}>
          <div className={styles.bigRating}>{REVIEW_SUMMARY.avgRating}</div>
          <Stars rating={Math.round(REVIEW_SUMMARY.avgRating)} size={18} />
          <p className={styles.ratingCount}>
            {REVIEW_SUMMARY.totalReviews} reviews
          </p>

          <div className={styles.breakdown}>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = REVIEW_SUMMARY.breakdown[star];
              const pct = (count / REVIEW_SUMMARY.totalReviews) * 100;
              return (
                <div key={star} className={styles.breakdownRow}>
                  <span className={styles.starLabel}>{star}★</span>
                  <div className={styles.barBg}>
                    <div className={styles.barFill} style={{ width: `${pct}%` }} />
                  </div>
                  <span className={styles.barCount}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Recent Reviews */}
        <div className={styles.recentReviews}>
          {REVIEW_SUMMARY.recentReviews.map((r) => (
            <div key={r.id} className={styles.miniReview}>
              <div className={styles.reviewAvatar}>{r.initials}</div>
              <div className={styles.miniReviewBody}>
                <div className={styles.reviewHead}>
                  <strong>{r.reviewer}</strong>
                  <span className={styles.reviewDate}>{r.date}</span>
                </div>
                <Stars rating={r.rating} size={12} />
                <p className={styles.reviewText}>"{r.comment}"</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}