import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/utils/auth";
import { headers } from "next/headers";

const f = createUploadthing();

export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({}) => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });
      if (!session) throw new UploadThingError("Unauthorized");

      return { user: session.user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.user.id);

      console.log("file url", file.ufsUrl);

      return { uploadedBy: metadata.user.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
