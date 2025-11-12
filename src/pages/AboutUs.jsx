import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left side - Image */}
          <div className="relative w-full">
            <div className="aspect-[3/4] w-full overflow-hidden rounded-lg">
              <img
                src="/logo.png"
                alt="Elf Amor Perfume"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right side - Content */}
          <div className="space-y-8 lg:pt-8">
            {/* Section 1 */}
            <div>
              <h2 className="text-sm font-semibold tracking-wider text-gray-700 mb-6">
                A BRAND BORN FROM AMBITION
              </h2>

              <p className="text-xs leading-relaxed text-gray-600 mb-6">
                Elf Amor isn’t just a brand — it’s a reflection of ambition, drive, and the courage to
                stand apart. We exist for those who see life not as it is, but as it could be — for
                people who are constantly chasing growth, success, and self-definition.
              </p>

              <p className="text-xs leading-relaxed text-gray-600 mb-6">
                We believe everyone is the hero of their own story — the one who keeps moving, keeps
                building, and keeps becoming. Every product we create is designed to embody that
                spirit of self-belief and purpose. It’s not just something you wear; it’s something
                you own with confidence.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-gray-700 mb-4">
                CRAFTED WITH PURPOSE, ELEVATED BY PASSION
              </h3>

              <p className="text-xs leading-relaxed text-gray-600 mb-6">
                From our design philosophy to our premium formulations, every detail is made to
                inspire. Elf Amor stands for those who choose excellence — who value quality not as
                luxury, but as a way of life.
              </p>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-gray-700 mb-4">
                NOT YOUR AVERAGE BRAND
              </h3>

              <p className="text-xs leading-relaxed text-gray-600 mb-6">
                Elf Amor doesn’t blend in. It redefines what it means to aspire, to dream, and to
                achieve. We’re here for those who aren’t afraid to reach higher and live louder.
              </p>

              <p className="text-xs leading-relaxed text-gray-600 font-semibold">
                Elf Amor — for those becoming something great.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
