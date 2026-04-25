import { CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "For individuals just getting started with link management.",
      buttonText: "Current Plan",
      buttonVariant: "secondary" as const,
      features: [
        "25 short links / month",
        "Basic analytics",
        "Custom slugs",
        "Link expiration",
        "1 member seat",
      ],
      featured: false,
    },
    {
      name: "Pro",
      price: "$29",
      description: "For teams that need more power and flexibility.",
      buttonText: "Upgrade to Pro",
      buttonVariant: "primary" as const,
      features: [
        "Unlimited short links",
        "Full analytics dashboard",
        "Custom slugs & domains",
        "Password protection",
        "Priority email support",
        "10 member seats",
      ],
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations with custom needs.",
      buttonText: "Contact Sales",
      buttonVariant: "secondary" as const,
      features: [
        "Everything in Pro",
        "Custom integrations",
        "Dedicated account manager",
        "SSO & SAML",
        "24/7 phone support",
        "Unlimited member seats",
      ],
      featured: false,
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Choose the right plan for your business
        </h1>
        <p className="text-text-secondary">
          Unlock advanced features and scale your link management with our flexible pricing plans.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-stretch pt-4">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white border rounded-2xl p-8 flex flex-col transition-all duration-300 ${
              plan.featured
                ? "border-primary shadow-2xl shadow-primary/10 ring-1 ring-primary scale-[1.02] z-10"
                : "border-border hover:border-primary-border hover:shadow-xl"
            }`}
          >
            {plan.featured && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary rounded-full text-white text-xs font-bold tracking-wide shadow-lg shadow-primary/30 whitespace-nowrap">
                Most Popular
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-xl font-bold text-text-primary mb-2">
                {plan.name}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {plan.description}
              </p>
            </div>

            <div className="mb-8">
              <div className="flex items-end gap-1">
                <span className="text-4xl font-extrabold text-text-primary">
                  {plan.price}
                </span>
                {plan.price !== "Custom" && (
                  <span className="text-text-muted text-sm mb-1">/ Month</span>
                )}
              </div>
            </div>

            <Button
              variant={plan.buttonVariant}
              className={`w-full mb-8 ${
                plan.name === "Free" ? "opacity-50 cursor-default pointer-events-none" : ""
              }`}
            >
              {plan.buttonText}
            </Button>

            <div className="space-y-4 flex-1">
              <p className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
                {plan.name} plan includes
              </p>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2
                      className={`h-5 w-5 shrink-0 ${
                        plan.featured ? "text-primary" : "text-text-muted"
                      }`}
                    />
                    <span className="text-sm text-text-secondary leading-tight">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-bg-muted rounded-2xl p-8 border border-border text-center">
        <h4 className="text-lg font-bold text-text-primary mb-2">Need a custom solution?</h4>
        <p className="text-text-secondary text-sm max-w-xl mx-auto mb-6">
          We offer tailored plans for large-scale operations. Get in touch with our sales team to discuss your specific requirements.
        </p>
        <Button variant="secondary">Schedule a Call</Button>
      </div>
    </div>
  );
}
