import { Container } from "react-bootstrap"
import MyCards from "@/components/myCards";

export default function Category() {
    const categoryCards = [
        {
            cardTitle: "Kernel",
            cardText: "A computer program that acts as the core of an operating system by managing system resources.",
            pathRef: "/category/kernel",
            buttonText: "Learn More"  
        }, {
            cardTitle: "Workload",
            cardText: "Bundles of resources and any input parameters.",
            pathRef: "/category/workload",
            buttonText: "Learn More"  
        }, {
            cardTitle: "Benchmark",
            cardText: "A program that is used to test the performance of a computer system.",
            pathRef: "/category/benchmark",
            buttonText: "Learn More"  
        }, {
            cardTitle: "Binary",
            cardText: "An executable program.",
            pathRef: "/category/binary",
            buttonText: "Learn More"  
        }, {
            cardTitle: "Bootloader",
            cardText: "A small program that is responsible for loading the operating system into memory when a computer starts up.",
            pathRef: "/category/bootloader",
            buttonText: "Learn More"  
        }, {
            cardTitle: "Diskimage",
            cardText: "A file that contains an exact copy of the data stored on a storage device.",
            pathRef: "/category/diskimage",
            buttonText: "Learn More"  
        }, {
            cardTitle: "Resource",
            cardText: "",
            pathRef: "/category/resource",
            buttonText: "Learn More"  
        }, {
            cardTitle: "Checkpoint",
            cardText: "A snapshot of a simulation.",
            pathRef: "/category/checkpoint",
            buttonText: "Learn More"  
        }, {
            cardTitle: "Simpoint",
            cardText: "A sampling method that increases the speed of gem5 simulations.",
            pathRef: "/category/simpoint",
            buttonText: "Learn More"  
        }
    ];

    return (
        <Container>
            <div className='cardsBlockContainer mt-5 mb-5'>
                <h2 className='primary page-title'>Categories</h2>
                <p className='text-muted main-text-regular'>These are the "Categories" of Resources we use on this website.</p>
                <div className='cardsContainer' style={{ justifyContent: 'center' }}>
                    {categoryCards.map((card, index) => (
                        <MyCards className="cardStyle" key={index} cardTitle={card.cardTitle} cardText={card.cardText} pathRef={card.pathRef} buttonText={card.buttonText} />
                    ))}
                </div>
            </div>
        </Container>
    );
}