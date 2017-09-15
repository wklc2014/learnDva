/**
 * 富文本编辑器
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import propTypes from 'prop-types';
import lodash from 'lodash';
import { Form, Checkbox } from 'antd';
import Simditor from "simditor";
import $ from 'jquery';

const FormItem = Form.Item;

class BaseEditor extends Component {

    componentDidMount() {
         this.initEditor();
    }

    initEditor = () => {
        const { placeholder, value, id } = this.props;
        const config = {
            placeholder,
            defaultImage: 'images/image.png',
            params: {},
            tabIndent: true,
            toolbar: [
                'title',
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'fontScale',
                'color',
                'link',
                'hr',
                'image',
                'indent',
                'outdent',
                'alignment',
            ],
            toolbarFloat: true,
            toolbarFloatOffset: 0,
            toolbarHidden: false,
            pasteImage: false,
            cleanPaste: false,
            textarea: $(`#${id}`),
        };

        this.editor = new Simditor(config);
        if (value) {
            this.editor.setValue(value);
        }

        //监听改变
        this.editor.on('valuechanged', (e, src) => {
            const id = this.props.id;
            const value = this.getValue();
            this.props.onChange({ id, value });
        });

        //更改图片上传类型
        $(".simditor input[type='file']").attr('accept', 'image/jpg,image/jpeg,image/png,image/bmp');
    };

    getValue = () => {
        const { id } = this.props;
        const { body } = getBaseEditorDom(id);
        const html = body.html();
        return html;
    };

    getRules = () => {
        const { rules, value } = this.props;
        const newRules = {};
        if (!rules) {
            return newRules;
        }
        rules.some((v) => {
            if (v.required) {
                newRules.required = true;
                if (value === '<p><br></p>') {
                    newRules.help = v.message;
                    newRules.validateStatus = 'error';
                } else {
                    newRules.help = '';
                    newRules.validateStatus = 'success';
                }
            }
            return v.required;
        });
        return newRules;
    }

    render() {
        const {
            className,
            label,
            layout,
            style,
            value,

            disabled,
            id,
            onChange,
            options,
            rules,
        } = this.props;

        const defaultProps = {
            disabled,
            id,
            style,
        };

        const ChildEle = <textarea {...defaultProps} />;
        const newRules = this.getRules();

        return (
            <FormItem
                {...layout}
                label={label}
                className={className}
                {...newRules}
            >
                <div id={`FormItem_${id}_Wraper`}>
                    {ChildEle}
                </div>
            </FormItem>
        );
    }
}

BaseEditor.propTypes = {
    className: propTypes.string,
    label: propTypes.string,
    layout: propTypes.object,
    style: propTypes.object,

    disabled: propTypes.bool,
    id: propTypes.string.isRequired,
    onChange: propTypes.func.isRequired,
    rules: propTypes.array,
};

function _getJqDom(id) {
    const $wraper = $(`#FormItem_${id}_Wraper .simditor`);
    return {
        body: $wraper.find(".simditor-body"),
        placeholder: $wraper.find(".simditor-placeholder"),
    };
}

function _getJqDomPlaceholder(id) {
    return _getJqDom(id).placeholder;
}
function _getJqDomBody(id) {
    return _getJqDom(id).body;
}

export default BaseEditor;
