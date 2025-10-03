//marthanussbaum
import React from "react";
import { BookOpen, Star, Award } from "lucide-react";

const MarthaNussbaumDashboard = () => {
  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex items-center gap-6 mb-8">
        <img
          src="data:image/jpeg;base64,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"
          alt="Martha Nussbaum"
          className="w-32 h-32 object-cover rounded-full shadow-lg"
        />
        <div>
          <h1 className="text-3xl font-bold">Martha C. Nussbaum</h1>
          <p className="text-gray-600 text-lg">📖 Philosopher | Ethics & Human Development</p>
          <p className="mt-2 text-sm text-gray-500 max-w-2xl">
            Martha Nussbaum is an American philosopher and the Ernst Freund Distinguished 
            Service Professor of Law and Ethics at the University of Chicago. She is renowned 
            for her work in political philosophy, ethics, and human capabilities approach.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow p-6 rounded-2xl flex items-center gap-4">
          <BookOpen className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold">15+</h2>
            <p className="text-gray-600">Books Published</p>
          </div>
        </div>
        <div className="bg-white shadow p-6 rounded-2xl flex items-center gap-4">
          <Star className="w-8 h-8 text-yellow-500" />
          <div>
            <h2 className="text-xl font-semibold">Global Impact</h2>
            <p className="text-gray-600">Ethics & Human Rights</p>
          </div>
        </div>
        <div className="bg-white shadow p-6 rounded-2xl flex items-center gap-4">
          <Award className="w-8 h-8 text-green-600" />
          <div>
            <h2 className="text-xl font-semibold">Multiple Awards</h2>
            <p className="text-gray-600">Kyoto Prize, Berggruen Prize</p>
          </div>
        </div>
      </div>

      {/* Featured Books */}
      <h2 className="text-2xl font-bold mb-4">Featured Books</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-2xl p-4">
          <img
            src="https://images-na.ssl-images-amazon.com/images/I/71d+YX2jF0L.jpg"
            alt="Creating Capabilities"
            className="w-full h-64 object-cover rounded-lg"
          />
          <h3 className="text-lg font-semibold mt-3">Creating Capabilities</h3>
          <p className="text-gray-600 text-sm">A framework for human development and justice.</p>
        </div>

        <div className="bg-white shadow rounded-2xl p-4">
          <img
            src="https://images-na.ssl-images-amazon.com/images/I/81s1p1QbGdL.jpg"
            alt="Political Emotions"
            className="w-full h-64 object-cover rounded-lg"
          />
          <h3 className="text-lg font-semibold mt-3">Political Emotions</h3>
          <p className="text-gray-600 text-sm">The role of love and emotions in sustaining democracy.</p>
        </div>

        <div className="bg-white shadow rounded-2xl p-4">
          <img
            src="https://images-na.ssl-images-amazon.com/images/I/71S+gWwZxqL.jpg"
            alt="The Fragility of Goodness"
            className="w-full h-64 object-cover rounded-lg"
          />
          <h3 className="text-lg font-semibold mt-3">The Fragility of Goodness</h3>
          <p className="text-gray-600 text-sm">Exploration of ethics and tragedy in Greek thought.</p>
        </div>
      </div>
    </div>
  );
};

export default MarthaNussbaumDashboard;
