import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';

const AddLesson = () => {
  // const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    emotionalTone: '',
    image: '',
    privacy: 'Public',
    accessLevel: 'Free'
  });

  const categories = ['Personal Growth', 'Career', 'Relationships', 'Mindset', 'Mistakes Learned'];
  const emotionalTones = ['Motivational', 'Sad', 'Realization', 'Gratitude'];

  // Check if user is premium (replace with your actual logic)
  const isPremium = false;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-2">Add New Lesson</h1>
          <p className="text-gray-600">Share your wisdom and life experiences with the community</p>
        </div>

        {/* Form */}
        <form className="bg-white rounded-lg border-4 border-black p-8" style={{ boxShadow: '8px 8px 0px 0px #000' }}>
          
          {/* Lesson Title */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Lesson Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
              placeholder="Enter your lesson title"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Full Description */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Full Description / Story / Insight *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
              placeholder="Share your story, insight, or life lesson in detail..."
              rows="10"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Category and Emotional Tone - Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Emotional Tone */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Emotional Tone *
              </label>
              <select
                name="emotionalTone"
                value={formData.emotionalTone}
                onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">Select Tone</option>
                {emotionalTones.map(tone => (
                  <option key={tone} value={tone}>{tone}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              Image URL (Optional)
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Privacy and Access Level - Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            
            {/* Privacy */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Privacy *
              </label>
              <select
                name="privacy"
                value={formData.privacy}
                onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
            </div>

            {/* Access Level */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Access Level *
              </label>
              <div className="relative">
                <select
                  name="accessLevel"
                  value={formData.accessLevel}
                  onChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
                  disabled={!isPremium}
                  className={`w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    !isPremium ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  required
                >
                  <option value="Free">Free</option>
                  <option value="Premium" disabled={!isPremium}>Premium</option>
                </select>
                {!isPremium && (
                  <p className="text-xs text-gray-500 mt-1">
                    ⚠️ Upgrade to Premium to create paid lessons
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 text-lg font-bold text-black rounded-lg transition-all"
            style={{
              backgroundColor: '#ffdb58',
              boxShadow: '4px 4px 0px 0px #000'
            }}
          >
            Create Lesson
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddLesson;