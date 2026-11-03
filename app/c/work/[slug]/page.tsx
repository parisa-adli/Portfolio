import { workRoute } from "@/components/core/workRoute";

const route = workRoute("c");
export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
