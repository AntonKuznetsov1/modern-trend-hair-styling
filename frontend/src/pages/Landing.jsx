import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Landing() {
  const polePattern = "repeating-linear-gradient(-45deg, #dc2626 0, #dc2626 40px, #ffffff 40px, #ffffff 80px, #1d4ed8 80px, #1d4ed8 120px, #ffffff 120px, #ffffff 160px)";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row h-screen">
        <div className="md:w-1/2 flex flex-col justify-center px-8 md:px-16 bg-zinc-900 text-white">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Modern Trend Hair Styling</h1>
          <p className="text-lg mb-8 leading-relaxed text-gray-300">
            With years of dedicated experience, we are your premier barbershop specializing in men's styling, precision beard trimming, and standard military cuts. Ladies' cuts are also welcome. Open Monday through Saturday.
          </p>
          <div className="flex gap-4">
            <Link to="/booking" className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded shadow-lg transition-colors">
              Book Appointment
            </Link>
            <Link to="/blog" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded shadow-lg transition-colors">
              Read Our Blog
            </Link>
          </div>
        </div>
        <div 
          className="md:w-1/2 h-64 md:h-full border-l-8 border-gray-800 shadow-inner"
          style={{ background: polePattern }}
        ></div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-8 md:px-16 bg-white max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-3xl font-bold mb-6 border-b-4 border-red-600 inline-block pb-2">Get In Touch</h2>
          <div className="space-y-4 mb-8 text-gray-700">
            <p className="flex items-center gap-3"><MapPin className="text-blue-600"/> 144 Gibson Street, Fredericton, NB, Canada, E3A 4E2</p>
            <p className="flex items-center gap-3"><Phone className="text-blue-600"/> (506) 472-8199</p>
            <p className="flex items-center gap-3"><Mail className="text-blue-600"/> uscdarrell@gmail.com</p>
          </div>
        </div>
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <input type="text" placeholder="Your Name" className="border p-3 rounded bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" required />
          <input type="email" placeholder="Your Email" className="border p-3 rounded bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" required />
          <textarea rows="4" placeholder="Your Message" className="border p-3 rounded bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" required></textarea>
          <button type="submit" className="bg-zinc-900 text-white py-3 rounded font-bold hover:bg-zinc-800 transition">Send Message</button>
        </form>
      </section>
    </div>
  );
}