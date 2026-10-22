// src/types/loyalty.ts
// Shapes returned by the Elixser Loyalty API plugin (elx/v1/loyalty/*).
// Field names match the plugin exactly, so nothing has to be renamed in between.

/** A rung on the ladder: Member, Insider, Elite. */
export interface LoyaltyTier {
  id: number;
  name: string;
  badge: string;
  fromPoints: number;
  // 0 on the top tier, which has no ceiling
  toPoints: number;
}

/** The tier above the current one, with the gap already worked out by WordPress. */
export interface LoyaltyNextTier extends LoyaltyTier {
  pointsNeeded: number;
}

/**
 * One reward. `rewardTable` says which list it came from:
 *   "reward"      — still in the catalogue, costs points to claim
 *   "user_reward" — already claimed, so it carries a usable coupon `code`
 */
export interface LoyaltyReward {
  id: number;
  rewardTable: "reward" | "user_reward";
  name: string;
  displayName: string;
  rewardType: string;
  discountType: string;
  discountValue: number;
  requirePoint: number;
  // Ready to print, e.g. "Fixed discount - $5.00" — WordPress builds the wording
  discountLabel: string;
  code: string;
  status: string;
  // Unix seconds, 0 when the reward never expires
  expiresAt: number;
  icon: string;
}

/** One card in the "ways to earn rewards" grid, straight from the campaigns. */
export interface LoyaltyWayToEarn {
  id: number;
  name: string;
  // WPLoyalty's own wording, e.g. "1 point for each $1.00 spent". A referral card carries
  // two lines separated by <br>, which is the only tag allowed through.
  description: string;
  actionType: string;
  icon: string;
}

/** The third card under MY POINTS: rewards already spent, and what they were worth. */
export interface LoyaltyUsedRewards {
  count: number;
  value: number;
}

/** The two things a shopper can change on this page. */
export interface LoyaltySettings {
  emailOptIn: boolean;
  // YYYY-MM-DD, empty when they never set one
  birthday: string;
  // False once a date is saved and wp-admin forbids changing it
  birthdayEditable: boolean;
}

export interface LoyaltyReferral {
  code: string;
  url: string;
}

/** Everything the account page needs, in one request. */
export interface LoyaltySummary {
  email: string;
  points: number;
  // "points" or "point" — the client can rename these in wp-admin
  pointsLabel: string;
  usedPoints: number;
  earnedPoints: number;
  // Coupons made from points — the "Points to Coupons" line
  couponCount: number;
  tier: LoyaltyTier | null;
  nextTier: LoyaltyNextTier | null;
  usedRewards: LoyaltyUsedRewards;
  referral: LoyaltyReferral;
  rewards: LoyaltyReward[];
  waysToEarn: LoyaltyWayToEarn[];
  settings: LoyaltySettings;
}

/** One page of claimed coupons — the Coupons or Used &amp; Expired tab. */
export interface LoyaltyCoupons {
  type: "active" | "expired";
  page: number;
  hasMore: boolean;
  items: LoyaltyReward[];
}

/** One entry in the points history. */
export interface LoyaltyActivity {
  id: number;
  actionType: string;
  // WPLoyalty's own label, e.g. "Convert points to coupon"
  actionName: string;
  // The readable note, e.g. "100 points earned"
  message: string;
  points: number;
  // The reward this row created, e.g. "$5 Off" — empty when none
  rewardName: string;
  orderId: number;
  // Unix seconds
  createdAt: number;
}

export interface LoyaltyHistory {
  page: number;
  hasMore: boolean;
  items: LoyaltyActivity[];
}

/** "Purchase & earn 100 points!" for one product or variation. */
export interface LoyaltyProductPoints {
  productId: number;
  points: number;
  message: string;
  // Where WPLoyalty is set to show this: "all" | "single" | "list"
  showOn: string;
}

/** What the cart earns, and what the shopper already has to spend. */
export interface LoyaltyCartPoints {
  points: number;
  balance: number;
  earnMessage: string;
  redeemMessage: string;
}

/** Everything the cart's "choose your rewards" popup shows, in one answer. */
export interface LoyaltyRewardsPopup {
  summary: LoyaltySummary;
  // null when WordPress could not list the coupons
  coupons: LoyaltyCoupons | null;
}

/** Answer from redeem and revoke. `code` is the WooCommerce coupon. */
export interface LoyaltyActionResult {
  success: boolean;
  message: string;
  code: string;
  // The balance after the change, so nothing has to be recalculated here
  points: number;
  // What the WordPress plugin made of mirroring this code into Tagada
  tagada?: string;
}

export interface LoyaltyReferralClaim {
  linked: boolean;
  // "linked" | "own_code" | "unknown_code" | "not_eligible"
  reason: string;
}
