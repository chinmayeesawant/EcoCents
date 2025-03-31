import ReactGA from "react-ga4";

ReactGA.initialize("G-RY230MPTVH"); // 🔁 Use your Measurement ID here

export const trackPageView = (url) => {
  ReactGA.send({ hitType: "pageview", page: url });
};

export const trackEvent = (category, action, label = "") => {
  ReactGA.event({ category, action, label });
};
