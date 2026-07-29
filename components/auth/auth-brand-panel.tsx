

import Image from "next/image";

export function AuthBrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-zinc-900 lg:flex lg:w-1/2">
      <Image
        src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600&auto=format&fit=crop"
        alt="Authentication Banner"
        fill
        priority
        className="object-cover"
      />
    </div>
  );
}