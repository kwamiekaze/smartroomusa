# Smart Room Gateway

Create a premium Smart Room USA website remake using the uploaded lobby image as the hero section background/image placeholder, designed to closely resemble the layout rhythm, polished long-scroll presentation, and conversion-focused structure of the user's recent debiesewing.com Lovable project. The site should feel luxurious, trustworthy, mobile-first, warm, and high-converting, with a dark wood, black marble, gold accent, luxury hotel/lobby aesthetic that matches the attached Smart Room USA image.

Brand/site: Smart Room USA / Smart Roomz. Hero wall text in the image says SMART ROOM USA and slogan: “Come stay with us”. Use this exact slogan. The attached hero image should be displayed prominently in the first hero section and architected so it can later be replaced with a smooth looped hero video without changing the layout. Treat the image/video as a cinematic hero visual with subtle overlay gradients, warm gold lighting, and readable text.

Important design direction:
- Layout should be almost identical in structure and feel to debiesewing.com Lovable project: premium hero, clear CTA buttons, service/benefit sections, process/how-it-works section, FAQ, strong contact/action area, polished spacing, animated section reveals, beautiful cards, mobile-first layout.
- Use dark luxury palette: deep charcoal/black, dark brown wood tones, black marble, warm gold, champagne, cream text.
- Typography should be elegant and readable. Use luxury serif for headings and clean sans-serif for body.
- Make the website look like a real premium housing/room rental brand, not a generic template.
- Include subtle animations similar to Debie’s project: smooth fade-ins, gentle parallax feeling, soft glow CTA hover states, card lift on hover, warm gold dividers, scroll-friendly sections.
- Ensure the hero supports replacement with a looped video later: create a HeroMedia component or clearly structured media container using the uploaded image now, with object-cover, stable aspect ratio, overlay, and no hardcoded layout that would break when a video is swapped in.

Homepage content and sections:
1. Hero Section
- Use attached lobby image as main hero media.
- Overlay headline: “Smart Room USA”
- Subheadline: “Come stay with us”
- Supporting text: “Affordable smart room living with simple weekly move-in pricing, shared amenities, utilities, WiFi, and a straightforward qualification process.”
- CTA buttons: “Book a Room” and “Call Now”
- Include small trust/benefit chips: “Weekly Rent Options”, “Utilities Included”, “WiFi Included”, “Simple Move-In Process”

2. Quick Move-In Requirements Section
Title: “What You Need To Move In”
Cards:
- Valid Identification
- Proof of Income
- One Week Rent
- $200 Security Deposit
- $89 Administrative & Application Fee
Make this section clean and easy to understand.

3. Cost To Move In Section
Title: “Simple Move-In Cost”
Content:
“One week rent + $200 security deposit + $89 administrative fee & application fee.”
Example card:
“If monthly rent is $800, you only pay $200 weekly + $200 security deposit + $89 administrative fee. Total move-in cost: $489.00.”
Make the $489.00 number visually prominent in gold.

4. What’s Included Section
Title: “What Renters Can Use In The House”
Include beautiful icon cards for:
- WiFi
- Utilities
- Common Areas
- Living Room
- Kitchen
- Bathroom
Use warm home/luxury icons and concise explanations.

5. SmartRoomz House Experience Section
Title: “Comfortable Shared Living”
Text: “There is an average of 3 to 4 renters in every SmartRoomz House, creating a manageable shared-living environment with access to common household spaces.”
Design as a premium lifestyle panel.

6. Refunds, Transfers & Deposits Section
Title: “Clear Rental Terms”
Cards:
- “All rentals are final.”
- “Rents can transfer to another room free of charge within the first 24 hours of occupying.”
- “Deposits are refunded within 48 hours of moving out after proper move-out notice.”
- “All move-outs must be emailed and called in.”
Keep this section clear, professional, and non-threatening.

7. FAQ Section
Use accordion style with these exact Q&A pairs:
Q: How do I pay rent and how do I qualify to move into a smart room?
A: All renters must have identification, show proof of income, and pay one week rent plus a $200 security deposit and an $89 administrative fee.
Q: Are rooms refundable?
A: All rentals are final. Rents can transfer to another room free of charge within the first 24 hours of occupying.
Q: How many people can live in a house?
A: There is an average of 3 to 4 renters in every SmartRoomz House.
Q: As a renter, what can I use in the house?
A: Renters can use WiFi, utilities, common areas, the living room, kitchen, and bathroom.
Q: How do I get my deposit back?
A: All deposits are refunded within 48 hours of moving out. All move-outs must be emailed and called in.

8. Final CTA Section
Title: “Ready To Move Into A Smart Room?”
Text: “Start with a simple qualification process and weekly move-in pricing.”
Buttons: “Book a Room” and “Call Now”

Functional requirements:
- Build a polished responsive single-page site.
- Use the uploaded image as the hero image asset if available in the project context. If direct asset import is not available, create a placeholder hero image block and clearly label the image path/asset area so the user can upload/replace it in Lovable.
- CTAs should link to placeholder anchors/contact actions: Book a Room -> #booking, Call Now -> tel:4040000000 for now, with visible comment/structure so phone number can be replaced.
- Include a booking/contact section or modal placeholder with fields: Full Name, Phone Number, Email, Desired Move-In Date, Proof of Income Status, Message.
- Style should be production-level, not plain.
- Do not create backend unless needed; keep it frontend-first with a working form UI placeholder.
- Ensure spelling consistency: use “Smart Room USA” for formal brand and “SmartRoomz House” only where the provided text uses SmartRoomz.
- Do not include unrelated sewing content; only match debiesewing.com’s layout and premium style, not its business copy.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://smartroomusa.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/aff0a9c2-e8ff-40c6-b413-26ce7370dfc7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
