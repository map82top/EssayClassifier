import React from "react";
import { CellMeasurerCache, CellMeasurer, List, AutoSizer} from "react-virtualized";
import "./_style.scss";
import ResizeObserver from 'rc-resize-observer';

class VirtualList extends React.Component {
    constructor(props, context) {
        super(props, context);

        this._cache = new CellMeasurerCache({
            fixedWidth: true,
        });

        this._rowRenderer = this._rowRenderer.bind(this);
    }

    _rowRenderer(args) {
        const {index, key, parent, style} = args;
        return (
            <CellMeasurer
                cache={this._cache}
                columnIndex={1}
                key={key}
                rowIndex={index}
                parent={parent}
            >
                {({ measure }) => (
                    <div key={key}>
                        <ResizeObserver onResize={measure}>
                            { this.props.itemRenderer ? this.props.itemRenderer({item: this.props.list[index], ...args}) : '' }
                        </ResizeObserver>
                    </div>
              )}
            </CellMeasurer>
        );
    }

     _noRowsRenderer() {
        return <div className="virtual-list-empty">Нет данных для отображения</div>;
    }

    render() {
        return (
            <AutoSizer>
                {({width, height}) => (
                    <List
                        className="virtual-list"
                        deferredMeasurementCache={this._cache}
                        overscanRowCount={0}
                        rowCount={this.props.list.length}
                        rowHeight={this._cache.rowHeight}
                        rowRenderer={this._rowRenderer}
                        width={width}
                        height={height}
                        noRowsRenderer={this._noRowsRenderer}
                        style={{outline: 'none'}}
                    />
                )}
            </AutoSizer>
        )
    }
}

export default VirtualList;