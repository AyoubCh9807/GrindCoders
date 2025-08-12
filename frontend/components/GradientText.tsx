export const GradientText: React.FC<{
  text?: string, 
  isLang?: boolean, 
  shinyClassName?: string;
  className?: string;
}> =
 ({text, 
  isLang,
  shinyClassName,
  className
}) => {

    if(!text) { console.error("Text cannot be empty in GradientText component") ;return }
    let gradientClass = "shiny-text-default"
    if(isLang) {
        gradientClass = `shiny-text-${text.toLowerCase()}` || 'shiny-text-default';
    }

  return (
    <span className={`${className} ${shinyClassName ?? gradientClass}`}>
      {text}
    </span>
  );
};
