import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("theme") !== "dark") {
      document.documentElement.classList.remove("dark");
      console.log("removeing dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }

  return <Component {...pageProps} />;
}
