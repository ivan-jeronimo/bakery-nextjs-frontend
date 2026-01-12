export default function HeroSection() {
  return (
    <section className="relative w-full min-h-[500px] flex items-center justify-center overflow-hidden pb-[70px]">
      <div className="absolute inset-0 z-0">
          <img 
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop" 
              alt="Fondo Panadería" 
              className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply"></div>
      </div>
      <div className="relative z-10 text-center px-4 mt-10">
        <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-md tracking-wide">
          Panadería Panciencia
        </h1>
      </div>
      <div 
          className="absolute bottom-0 left-0 w-full pointer-events-none z-20"
          style={{
              height: '70px',
              backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSI3MHB4IiB2aWV3Qm94PSIwIDAgMTI4MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZmZmZiI+PHBhdGggZD0iTTEyODAgODZjLTE5LjktMTcuMjEtNDAuMDgtMzkuNjktNzkuODktMzkuNjktNTcuNDkgMC01Ni45MyA0Ni41OS0xMTUgNDYuNTktNTMuNjEgMC01OS43Ni0zOS42Mi0xMTUuNi0zOS42MkM5MjMuNyA1My4yNyA5MjQuMjYgODcgODUzLjg5IDg3Yy04OS4zNSAwLTc4Ljc0LTg3LTE4OC4yLTg3QzU1NCAwIDU0My45NSAxMjEuOCA0MjMuMzIgMTIxLjhjLTEwMC41MiAwLTExNy44NC01NC44OC0xOTEuNTYtNTQuODgtNzcuMDYgMC0xMDAgNDguNTctMTUxLjc1IDQ4LjU3LTQwIDAtNjAtMTIuMjEtODAtMjkuNTF2NTRIMTI4MHoiLz48L2c+PC9zdmc+")`,
              backgroundSize: '100% 70px',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'bottom'
          }}
      ></div>
    </section>
  );
}
