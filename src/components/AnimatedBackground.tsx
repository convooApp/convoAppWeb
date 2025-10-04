export const AnimatedBackground = () => {
  return (
    <div 
      className="absolute inset-0 z-0"
      style={{
        background: 'linear-gradient(135deg, #0f0c29, #302b63, #B83280)',
        backgroundSize: '400% 400%',
        animation: 'gradientFlow 12s ease infinite'
      }}
    />
  );
};