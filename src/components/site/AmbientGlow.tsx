export function AmbientGlow() {
  return (
    <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[34rem] w-[48rem] max-w-full overflow-hidden">
      <div className="absolute -right-32 -top-44 h-[34rem] w-[42rem] rounded-full bg-[radial-gradient(closest-side,oklch(0.9_0.065_256/0.65),oklch(0.94_0.045_294/0.34)_45%,transparent_74%)] blur-3xl" />
    </div>
  );
}
