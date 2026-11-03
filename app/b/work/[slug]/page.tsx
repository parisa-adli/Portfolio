import { workRoute } from "@/components/core/workRoute";

const route = workRoute("b");
export const dynamicParams = false;
export const generateStaticParams = route.generateStaticParams;
export const generateMetadata = route.generateMetadata;
export default route.Page;
