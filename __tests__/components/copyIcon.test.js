import { render, screen, fireEvent, act } from '@testing-library/react';
import CopyIcon from '@/components/copyIcon';

const writeText = jest.fn();
navigator.clipboard = {
    writeText
}

describe('Copy Icon', () => {
    it('should render the copy icon', () => {
        const element = (
            <pre><code className="hljs language-sh">{"git "}<span className="hljs-built_in">clone</span>{" https://gem5.googlesource.com/public/gem5\n"}
                <span className="hljs-built_in">cd</span>{" gem5/util/m5\n"}
                scons build/x86/out/m5
            </code></pre>
        )
        act(() => {
            render(<CopyIcon >
                {element}
            </CopyIcon>)
        });
        const copyIcon = screen.getByLabelText('Copy to clipboard');
        expect(copyIcon).toBeInTheDocument();
        act(() => {
            fireEvent.click(copyIcon, element);
            jest.runAllTimers();
        });
        expect(writeText).toHaveBeenCalledWith('git clone https://gem5.googlesource.com/public/gem5\ncd gem5/util/m5\nscons build/x86/out/m5');
    });
});