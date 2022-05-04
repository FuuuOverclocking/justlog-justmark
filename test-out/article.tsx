import { Blog } from './types';

function blog(): Blog {
    return {
        ...{
            copyright: 'CC BY-ND 4.0',
            topics: ['rust', 'net'],
            lang: '简体中文',
            title: '博客标题',
        },
        content: (
            <div>
                <h1>博客标题</h1>
                <p>
                    博客内容<sub>a</sub>
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Column A</th>
                            <th>Column B</th>
                            <th>Column C</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td rowSpan={2}>A1</td>
                            <td>B1</td>
                            <td>C1</td>
                        </tr>
                        <tr>
                            <td>B2</td>
                            <td>C2</td>
                        </tr>
                        <tr>
                            <td>A3</td>
                            <td>B3</td>
                            <td>C3</td>
                        </tr>
                    </tbody>
                </table>
                <Button />
            </div>
        ),
    };
}

function Button() {
    return <button></button>;
}
