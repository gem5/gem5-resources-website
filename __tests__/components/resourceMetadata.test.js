import { render, screen, fireEvent } from '@testing-library/react';
import MetaData from '@/components/resourceMetadata';

describe('MetaData component', () => {
    it('should render correctly with default props', () => {
        render(<MetaData resource={{}} />);

        const authorLabel = screen.getByText('Author');
        expect(authorLabel).toBeInTheDocument();

        const descriptionLabel = screen.getByText('Description');
        expect(descriptionLabel).toBeInTheDocument();

        const licenseLabel = screen.getByText('License');
        expect(licenseLabel).toBeInTheDocument();

        const propertiesLabel = screen.getByText('Properties');
        expect(propertiesLabel).toBeInTheDocument();

        const dependLabel = screen.getByText('Depend on this resource');
        expect(dependLabel).toBeInTheDocument();
    });

    it('should show metadata when resource provided', () => {
        let resource = {
            "category": "simpoint",
            "id": "batman",
            "architecture": "X86",
            "tags": [],
            "author": [
                "Ujwal",
            ],
            "resource_version": "1.0.0",
            "database": "db1"
        }
        render(<MetaData resource={resource} />);
        expect(screen.getByText(/Ujwal/i)).toBeInTheDocument();
    });

    it('should show metadata when resource provided', () => {
        let resource = {
            "category": "simpoint",
            "id": "batman",
            "architecture": "X86",
            "tags": [],
            "author": [
                "Ujwal",
            ],
            "source_url": "https://www.gem5.org",
            "resource_version": "1.0.0",
            "database": "db1",
            "license": "MIT",
            "workloads": [
                "workload1",
                "workload2"
            ],
        }
        render(<MetaData resource={resource} metaFields={[{
            "name": "source_url",
            "schema": {
                "type": "string",
            },
            "content": "Source URL",
        }]} />);
        expect(screen.getByText(/Repository/i)).toBeInTheDocument();
        expect(screen.getByText(/MIT/i)).toBeInTheDocument();
    });
});
