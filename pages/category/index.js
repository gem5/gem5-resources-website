import { Container } from "react-bootstrap"
import MyCards from "@/components/myCards";
import { useEffect, useState } from "react";
import CategoryHeader from "@/components/categoryHeader";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import rehypeHighlight from "rehype-highlight/lib";
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import rehypeSlug from 'rehype-slug'
import rehypeRaw from 'rehype-raw'
import remarkFrontmatter from 'remark-frontmatter';
import CopyIcon from '@/components/copyIcon';
import { useRouter } from "next/router";

export default function Category() {
    const [categoryCards, setCategoryCards] = useState([]);
    const [category, setCategory] = useState(null);
    const [content, setContent] = useState("");
    const router = useRouter();

    async function fetchContent(url) {
        console.log(url);
        const category = url.split('#')[1];
        if (category === undefined) {
            setContent("");
            setCategory(null);
        }
        if (category) {
            setCategory(category);
            try {
                const content = (await import(`./${category}.md`)).default;
                setContent(content);
                console.log(content);
            } catch (e) {
                console.log(e);
                router.replace('/404');
            }
            return;
        }
    }

    useEffect(() => {
        fetchContent(window.location.hash);

        const onHashChangeStart = async (url) => {
            console.log(`Path changing to ${url}`);
            await fetchContent(url);
        };

        router.events.on("hashChangeStart", onHashChangeStart);

        return () => {
            router.events.off("hashChangeStart", onHashChangeStart);
        };
    }, [router.events]);

    useEffect(() => {
        fetch("https://raw.githubusercontent.com/Gem5Vision/json-to-mongodb/main/schema/test.json")
            .then(res => res.json())
            .then(data => {
                console.log(data['properties']['category']['enum']);
                const categoryCards = data['properties']['category']['enum'].map((category) => {
                    return {
                        cardTitle: category.charAt(0).toUpperCase() + category.substr(1).toLowerCase(),
                        cardText: data['definitions'][category]['description'],
                        pathRef: `/category#${category}`,
                        buttonText: "Learn More"
                    }
                })
                setCategoryCards(categoryCards);
            })
    }, [])

    return (
        category ?
            <Container>
                <CategoryHeader category={category} />
                <ReactMarkdown
                    className='markdown-body mt-3'
                    rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }], rehypeRaw, rehypeSlug]}
                    remarkPlugins={[remarkGfm, remarkToc, remarkFrontmatter]}
                    components={{
                        pre: ({ node, ...props }) =>
                            <CopyIcon>
                                <pre {...props} >
                                    {props.children}
                                </pre>
                            </CopyIcon>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </Container>
            :
            <Container>
                <div className='cardsBlockContainer mt-5 mb-5'>
                    <h2 className='secondary page-title mb-3'>Categories</h2>
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