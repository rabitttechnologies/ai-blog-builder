
export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: string;
  plan_id: string;
  period: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}
