export default interface GCloudDescribeResult {
    status: "RUNNING" | "TERMINATED";
    name: string;
    id: string;
    tags: {
        fingerprint: string;
        items: string[];
    };
    zone: string;
}
