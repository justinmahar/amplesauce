# YouTube Search Automation

* Woke up and had the breakthrough idea in my head. Instead of using AI generated avatars, instead, I'll use what I'm calling "bookends", or actual clips of me talking, that I sandwich around the AI generated content. This will give is a high quality human feeling, because it'll be a REAL human presenting around the content.  
* In addition to that, I'll tackle informational videos first, since tutorials are one of the hardest things to automate. Info videos can likely be fully automated.  
* I'll also build a system that allows a human to plug in content \-- images, videos, maybe even audio. For videos, I'll strip out the audio and send that. Can send audio to OpenAI or one of the many APIs for transcription.  
* Looked into Remotion/react. This is how I'd assemble the video.  
* So with this solution, I'd upload intros, subscribe CTAs, keep watching interludes, stuff like that. Then I'd let the AI decide which one to use for each of those. I'll make it so the AI is the one calling all the shots here. So each video will be a little different.  
* I'll also add different Sequence types, and have support for transitions of course. Sequences I want to support:  
  * Title screens  
  * Animated titles and lower thirds  
  * Icon/image popups  
  * Animated backgrounds  
  * Showing text on the screen while explaining things  
  * Dynamic charts/graphs (animated would be even better)  
* Media I'd like to support  
  * Pexels etc for stock videos and photos  
  * Maybe paid media libraries, too? API key for those  
  * Emoji libraries (use these for popups)  
  * Screenshots (use an API or a lib to grab these)  
* Basically support all the things you're doing now manually.  
* Name idea: Amplesauce (throwback to Asheron's Call)  
* The system would be end to end.  
  * Workspace manager (has users with roles)  
  * Asset manager for uploading bookends to workspace  
    * Bookends w/ transcripts and word time metadata  
  * Channel and series manager  
    * Basic details (channel ID, name, cover, description, profile image, adv: api key override)  
      * Can use API key to fetch this info automatically  
    * Flow prompts  
    * Thumbnail template manager  
      * Hero images  
      * Thumbnail styles \-- bg images, colors, text styles, left or right  
    * Video description settings  
      * Bottom text / top text  
      * Use mustache for template (advanced)  
    * Affiliate manager  
      * Add links and the text for them to be used in descriptions  
      * Add product info so AI can choose these automatically  
      * Later \-- List of programs (browser)  
    * YT API Key for setting titles/descriptions/thumbnails  
  * Keyword research tool  
    * Topic manager (so you can group keywords together)  
    * Keyword collection w/ semantic uniqueness (remove duplicates)  
    * Volume estimates and trends for keywords  
    * YT search results button \-- take a quick gander at how well it's doing  
    * Can paste in or upload custom list of keywords / incl uniqueness feature there too  
  * Video production tool using any video idea/keyword  
  * User management, roles, and (later) assignments  
* Those are the main parts once you have a video idea  
* Components for the video production tool:  
  * Research (collects the value/content w/ citations)  
    * Sets the source content from list of them  
  * Media manager for custom media  
    * User can upload their own content (icons, images, screenshots, screen recordings, etc)  
  * Scene JSON builder (includes script dialog and media w/ user input requests and fallbacks, uses structured JSON schema)  
    * User can swap out media if need be (either custom, fetch new ones such a stock media, or choose stock media from a browser/searcher, or provide URL to media?)  
    * Reroll as many times until it looks right  
  * Scene preview  
  * Media fetcher (generates/populates assets needed for video, stores in bucket)  
    * Voiceovers \- essential  
    * Stock media \- essential  
    * Fonts? Google Fonts \- essential  
    * Emojis \- nice to have  
    * Website screenshots \- nice to have  
    * Charts? ChartJS \- nice to have  
  * Cloud video renderer / download file  
    * Store these in the video / set as main video file  
  * Video Packager  
    * Generate thumbnail text  
    * Uses thumbnail templates  
    * Text on left, hero on right  
    * Can customize the hero for a video, or fall back on the library of them, fall back on an emoji hero after that  
    * Build image, render it, show download button (simple canvas or remotion? tbd)  
    * Show 5-10 of them, shuffled, with a shuffle button  
    * Set as thumbnail button (saves this image for the video)  
    * Title generator  
    * Description generator  
      * Description, chapters w/ timestamps  
      * Affiliate link text if configured/enabled (AI chooses most appropriate one)  
  * Details  
    * Chosen thumbnail, title, description, and embed/link to uploaded video w/ thumb (user adds link to video)  
    * If YT API key exists for account or channel, use that to set these for the video at the push of a button (50 quota units per op, so 100 total)  
* You can build a video manually too, if you want.  
  * In that case, you're skipping the research step and providing the source content yourself, then having it generate the video from that.  
  * You can do any of these steps manually, maybe except for generating the actual scene.  
  * This would be great for testing the overall system before automating each step.

