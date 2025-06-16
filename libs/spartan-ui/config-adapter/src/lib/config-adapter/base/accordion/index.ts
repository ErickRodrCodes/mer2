/**
 * This is the base class for SpartanUIConfig.
 * It is used to be used as implement for any configuration class that wants to be used in the Spartan UI library.
 * In this way, you can use a subset of the SpartanUIConfig class to override the default classes.
 */
export class AccordionConfigBase {
  public static AccordionIconDirective =
    'inline-block h-4 w-4 transition-transform [animation-duration:200]';
  public static AccordionContentComponent = 'text-sm transition-all grid';
  public static AccordionItemDirective =
    'flex flex-1 flex-col border-b border-border';
  public static AccordionTriggerDirective =
    'w-full focus-visible:outline-none text-sm focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2 flex flex-1 items-center justify-between py-4 px-0.5 font-medium underline-offset-4 hover:underline [&[data-state=open]>[hlmAccordionIcon]]:rotate-180 [&[data-state=open]>[hlmAccIcon]]:rotate-180';
  public static AccordionDirective = 'flex';
}
