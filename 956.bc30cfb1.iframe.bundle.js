"use strict";(self.webpackChunk_osuresearch_annotator=self.webpackChunk_osuresearch_annotator||[]).push([[956],{"./src/components/AnnotationsProvider/AnnotationsProvider.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{g:()=>AnnotationsProvider});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_hooks_useAnnotations__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/hooks/useAnnotations.ts"),_hooks_useAnnotationPicker__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/hooks/useAnnotationPicker.ts"),_hooks_useEditors__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/hooks/useEditors.ts"),react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/jsx-runtime.js");function AnnotationsProvider({children,initialItems,agent,role}){const ctx=(0,_hooks_useAnnotations__WEBPACK_IMPORTED_MODULE_2__.O)(initialItems,agent,role),editors=(0,_hooks_useEditors__WEBPACK_IMPORTED_MODULE_3__.w)(),[selected,select]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(),selectionCtx=(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)((()=>({select,selected,deselect:()=>select(void 0)})),[selected]);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_hooks_useAnnotations__WEBPACK_IMPORTED_MODULE_2__._.Provider,{value:ctx,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_hooks_useEditors__WEBPACK_IMPORTED_MODULE_3__._.Provider,{value:editors,children:(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_hooks_useAnnotationPicker__WEBPACK_IMPORTED_MODULE_4__._.Provider,{value:selectionCtx,children})})})}AnnotationsProvider.displayName="AnnotationsProvider";try{AnnotationsProvider.displayName="AnnotationsProvider",AnnotationsProvider.__docgenInfo={description:"Thin wrapper around the useAnnotations hook.",displayName:"AnnotationsProvider",props:{initialItems:{defaultValue:null,description:"",name:"initialItems",required:!1,type:{name:"Annotation[]"}},agent:{defaultValue:null,description:"The agent to use for newly created annotations",name:"agent",required:!0,type:{name:"AnnotationAgent"}},role:{defaultValue:null,description:"The role for the agent. This is heavily dependent\non the context in which the annotator is used.\n\nFor forms, this could be `Submitter`, `Reviewer`,\n`Analyst`, etc. Roles may also represent individual's\nrelationship to the submission, such as a `Principal Investigator`\nversus a `Co-Investigator` on a study.",name:"role",required:!0,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/AnnotationsProvider/AnnotationsProvider.tsx#AnnotationsProvider"]={docgenInfo:AnnotationsProvider.__docgenInfo,name:"AnnotationsProvider",path:"src/components/AnnotationsProvider/AnnotationsProvider.tsx#AnnotationsProvider"})}catch(__react_docgen_typescript_loader_error){}},"./src/components/ThreadList/ThreadList.tsx":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{o:()=>ThreadList});var react=__webpack_require__("./node_modules/react/index.js"),index_module=__webpack_require__("./node_modules/@osuresearch/ui/dist/index.module.js"),useAnnotationsContext=__webpack_require__("./src/hooks/useAnnotationsContext.ts");function useThread(id){const{annotations,createReply,updateBody,focused,patch,focus}=(0,useAnnotationsContext.i)(),[thread,setThread]=(0,react.useState)(),[replies,setReplies]=(0,react.useState)([]);return(0,react.useEffect)((()=>{const match=annotations.find((t=>t.id===id));match&&match!==thread&&setThread(match);const replies=annotations.filter((a=>a.target.source===id));setReplies(replies),console.log("useThread effect ",id)}),[annotations]),(0,react.useMemo)((()=>({thread,focused:focused?.id===id,replies,focus:()=>{thread&&focus(thread.id)},updateComment:message=>{thread&&updateBody("TextualBody",thread.id,(prev=>({...prev,value:message})))},remove:(recoverable=!0)=>{thread&&updateBody("Thread",thread.id,(prev=>({...prev,deleted:!0,recoverable}))),thread&&focused?.id===thread.id&&focus(void 0)},recover:()=>{thread&&updateBody("Thread",thread.id,(prev=>({...prev,deleted:!1})))},resolve:()=>{thread&&updateBody("Thread",thread.id,(prev=>({...prev,resolved:!0})))},reopen:()=>{thread&&updateBody("Thread",thread.id,(prev=>({...prev,resolved:!1})))},addReply:message=>{if(!thread)throw new Error("Invalid thread");const reply=createReply(thread.id,message);return updateBody("Thread",thread.id,(prev=>({...prev}))),reply},updateReply:(id,message)=>{if(replies.findIndex((r=>r.id===id))<0)throw new Error(`Could not update reply: annotation ${id} is not a reply to ${thread?.id}`);updateBody("TextualBody",id,(prev=>({...prev,value:message})))},removeReply:(id,recoverable=!0)=>{if(replies.findIndex((r=>r.id===id))<0)throw new Error(`Could not remove reply: annotation ${id} is not a reply to ${thread?.id}`);updateBody("ThreadReply",id,(prev=>({...prev,deleted:!0,recoverable})))},recoverReply:id=>{if(replies.findIndex((r=>r.id===id))<0)throw new Error(`Could not recover reply: annotation ${id} is not a reply to ${thread?.id}`);updateBody("ThreadReply",id,(prev=>({...prev,deleted:!1})))}})),[thread,replies,patch,focus])}var useAnchorsContext=__webpack_require__("./src/hooks/useAnchorsContext.ts"),dist_import=__webpack_require__("./node_modules/@react-aria/interactions/dist/import.mjs"),dist=__webpack_require__("./node_modules/@tiptap/react/dist/index.js"),extension_placeholder_dist=__webpack_require__("./node_modules/@tiptap/extension-placeholder/dist/index.js"),starter_kit_dist=__webpack_require__("./node_modules/@tiptap/starter-kit/dist/index.js"),parse_hotkey=__webpack_require__("./node_modules/@mantine/hooks/esm/use-hotkeys/parse-hotkey.js"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),useEditors=__webpack_require__("./src/hooks/useEditors.ts"),jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js");const EditorWrapper=styled_components_browser_esm.ZP.div`

  .ProseMirror {
    border: 1px solid var(--rui-light);
    padding: var(--rui-spacing-xs);
  }
  .ProseMirror-focused {
    outline: none;
    border: 1px solid var(--rui-light);
  }
`;function EditableMessage({defaultValue,placeholder,autosave=!1,onSave,onCancel}){const{setActiveEditor}=(0,react.useContext)(useEditors._),{focusWithinProps}=(0,dist_import.L_)({onBlurWithin:e=>{}}),editor=(0,dist.jE)({content:defaultValue,extensions:[starter_kit_dist.Z,extension_placeholder_dist.Z.configure({placeholder})]},[]),handleSave=()=>{if(!editor)return;const textContent=editor.getText(),content=editor.getHTML();editor.chain().clearContent().blur().run(),setActiveEditor(!1),textContent.length>0?onSave(content):onCancel()};return(0,react.useEffect)((()=>{editor&&editor.commands.focus("end"),setActiveEditor(!0)}),[editor]),(0,jsx_runtime.jsxs)(index_module.Kq,{align:"stretch",fs:"sm",children:[(0,jsx_runtime.jsx)(EditorWrapper,{children:(0,jsx_runtime.jsx)(dist.kg,{editor,onKeyDown:(0,parse_hotkey.yr)([["mod+Enter",handleSave]])})}),(0,jsx_runtime.jsxs)(index_module.ZA,{justify:"end",align:"center",children:[(0,jsx_runtime.jsx)(index_module.xv,{fs:"xs",c:"dark",children:"Tip: Press Ctrl+Enter to save."}),(0,jsx_runtime.jsx)(index_module.zx,{variant:"subtle",onPress:()=>{editor&&(editor.chain().clearContent().blur().run(),setActiveEditor(!1),onCancel())},children:"Cancel"}),(0,jsx_runtime.jsx)(index_module.zx,{onPress:handleSave,children:"Save"})]})]})}EditableMessage.displayName="EditableMessage";try{EditableMessage.displayName="EditableMessage",EditableMessage.__docgenInfo={description:"Rich text editor with a save/cancel button visible on mount.\n\na11y\n- Focuses on the text input on mount\n- Traps keyboard focus until closed",displayName:"EditableMessage",props:{defaultValue:{defaultValue:null,description:"",name:"defaultValue",required:!0,type:{name:"string"}},placeholder:{defaultValue:null,description:"",name:"placeholder",required:!1,type:{name:"string"}},autosave:{defaultValue:{value:"false"},description:"",name:"autosave",required:!1,type:{name:"boolean"}},onSave:{defaultValue:null,description:"",name:"onSave",required:!0,type:{name:"(value: string) => void"}},onCancel:{defaultValue:null,description:"",name:"onCancel",required:!0,type:{name:"() => void"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Thread/EditableMessage.tsx#EditableMessage"]={docgenInfo:EditableMessage.__docgenInfo,name:"EditableMessage",path:"src/components/Thread/EditableMessage.tsx#EditableMessage"})}catch(__react_docgen_typescript_loader_error){}var dayjs_min=__webpack_require__("./node_modules/dayjs/dayjs.min.js"),dayjs_min_default=__webpack_require__.n(dayjs_min);function Profile({node,showRole}){const body=node.body.find((b=>"ThreadReply"===b.type||"Thread"===b.type)),role=body?body.role:"";return(0,jsx_runtime.jsxs)(index_module.ZA,{align:"center",gap:"xs",fs:"sm",w:"100%",children:[(0,jsx_runtime.jsx)(index_module.qE,{alt:node.creator.name,size:40,name:node.creator.name,opicUsername:node.creator.nickname,style:{marginLeft:-36}}),(0,jsx_runtime.jsxs)(index_module.Kq,{gap:0,w:"100%",children:[(0,jsx_runtime.jsx)(index_module.ZA,{w:"100%",justify:"apart",children:(0,jsx_runtime.jsx)(index_module.xv,{fw:"bold",children:node.creator.name})}),(0,jsx_runtime.jsx)(index_module.xv,{fs:"xs",c:"dark",children:dayjs_min_default()(node.created).format("h:mm A MMM D")})]}),showRole&&role&&(0,jsx_runtime.jsx)(index_module.Af,{variant:"outline",c:"secondary",children:role})]})}Profile.displayName="Profile";try{Profile.displayName="Profile",Profile.__docgenInfo={description:"",displayName:"Profile",props:{node:{defaultValue:null,description:"",name:"node",required:!0,type:{name:"Annotation"}},showRole:{defaultValue:null,description:"",name:"showRole",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Thread/Profile.tsx#Profile"]={docgenInfo:Profile.__docgenInfo,name:"Profile",path:"src/components/Thread/Profile.tsx#Profile"})}catch(__react_docgen_typescript_loader_error){}function ReadOnlyMessage({message}){return(0,jsx_runtime.jsx)(index_module.xv,{fs:"sm",children:(0,jsx_runtime.jsx)("span",{dangerouslySetInnerHTML:{__html:message}})})}ReadOnlyMessage.displayName="ReadOnlyMessage";try{ReadOnlyMessage.displayName="ReadOnlyMessage",ReadOnlyMessage.__docgenInfo={description:"",displayName:"ReadOnlyMessage",props:{message:{defaultValue:null,description:"",name:"message",required:!0,type:{name:"string"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Thread/ReadOnlyMessage.tsx#ReadOnlyMessage"]={docgenInfo:ReadOnlyMessage.__docgenInfo,name:"ReadOnlyMessage",path:"src/components/Thread/ReadOnlyMessage.tsx#ReadOnlyMessage"})}catch(__react_docgen_typescript_loader_error){}const Reply=react.forwardRef((({thread,node},ref)=>{const{focused,replies,updateReply,removeReply,recoverReply}=useThread(thread.id),{hasActiveEditor}=(0,react.useContext)(useEditors._),[isEditing,setEditing]=(0,react.useState)(!1),body=node.body.find((b=>"TextualBody"===b.type)),state=node.body.find((b=>"ThreadReply"===b.type)),threadState=thread.body.find((b=>"Thread"===b.type)),defaultValue=body.value,{deleted,recoverable}=state,{resolved}=threadState;return deleted&&!recoverable?null:deleted&&recoverable?(0,jsx_runtime.jsxs)(index_module.xv,{p:"md",fs:"sm",children:["Deleted reply."," ",(0,jsx_runtime.jsx)(index_module.rU,{as:"button",onClick:()=>recoverReply(node.id),children:"(undo)"})]}):(0,jsx_runtime.jsxs)(index_module.Kq,{align:"stretch",gap:0,pl:"xl",tabIndex:0,children:[(0,jsx_runtime.jsxs)(index_module.ZA,{justify:"apart",align:"center",pb:"md",children:[(0,jsx_runtime.jsx)(Profile,{node,showRole:!0}),!resolved&&(0,jsx_runtime.jsxs)(index_module.v2,{label:(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{}),onAction:key=>("delete"===key?removeReply(node.id):"edit"===key&&setEditing(!0),!0),disabledKeys:hasActiveEditor?["edit","delete"]:[],children:[(0,jsx_runtime.jsx)(index_module.ck,{children:"Edit reply"},"edit"),(0,jsx_runtime.jsx)(index_module.ck,{children:(0,jsx_runtime.jsx)(index_module.xv,{c:"error",children:"Delete"})},"delete")]})]}),(0,jsx_runtime.jsx)(index_module.ZA,{pl:"md",children:isEditing?(0,jsx_runtime.jsx)(EditableMessage,{defaultValue,onSave:message=>{updateReply(node.id,message),setEditing(!1)},onCancel:()=>setEditing(!1)}):(0,jsx_runtime.jsx)(ReadOnlyMessage,{message:defaultValue})})]})}));try{Reply.displayName="Reply",Reply.__docgenInfo={description:"Render a comment as a reply to a thread",displayName:"Reply",props:{thread:{defaultValue:null,description:"",name:"thread",required:!0,type:{name:"Annotation"}},node:{defaultValue:null,description:"",name:"node",required:!0,type:{name:"Annotation"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Thread/Reply.tsx#Reply"]={docgenInfo:Reply.__docgenInfo,name:"Reply",path:"src/components/Thread/Reply.tsx#Reply"})}catch(__react_docgen_typescript_loader_error){}const Root=styled_components_browser_esm.ZP.div`
  border: 1px solid var(--rui-light);
  padding: var(--rui-spacing-xs);
`;function StartReply({thread}){const{hasActiveEditor}=(0,react.useContext)(useEditors._),[active,setActive]=(0,react.useState)(!1),{addReply}=useThread(thread.id);return(0,jsx_runtime.jsxs)(index_module.Kq,{align:"stretch",fs:"sm",children:[!active&&(0,jsx_runtime.jsx)(index_module.kG,{isDisabled:hasActiveEditor,as:Root,onPress:()=>{setActive(!0)},c:"dark",children:(0,jsx_runtime.jsx)(index_module.ZA,{children:hasActiveEditor?"Another comment is in progress.":"Reply"})}),active&&(0,jsx_runtime.jsx)(EditableMessage,{placeholder:"Reply",onSave:message=>{addReply(message),setActive(!1)},onCancel:()=>{setActive(!1)},defaultValue:""})]})}StartReply.displayName="StartReply";try{StartReply.displayName="StartReply",StartReply.__docgenInfo={description:"",displayName:"StartReply",props:{thread:{defaultValue:null,description:"",name:"thread",required:!0,type:{name:"Annotation"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Thread/StartReply.tsx#StartReply"]={docgenInfo:StartReply.__docgenInfo,name:"StartReply",path:"src/components/Thread/StartReply.tsx#StartReply"})}catch(__react_docgen_typescript_loader_error){}function useElementSize(){const[ref,{width,height}]=function useResizeObserver(){const frameID=(0,react.useRef)(0),ref=(0,react.useRef)(null),[rect,setRect]=(0,react.useState)({x:0,y:0,width:0,height:0}),observer=(0,react.useMemo)((()=>"undefined"!=typeof window?new ResizeObserver((entries=>{const entry=entries[0];entry&&(cancelAnimationFrame(frameID.current),frameID.current=requestAnimationFrame((()=>{ref.current&&setRect(entry.contentRect)})))})):null),[]);return(0,react.useEffect)((()=>(ref.current&&observer?.observe(ref.current),()=>{observer?.disconnect(),frameID.current&&cancelAnimationFrame(frameID.current)})),[ref.current]),[ref,rect]}();return{ref,width,height}}var data_dist_import=__webpack_require__("./node_modules/@react-stately/data/dist/import.mjs");const Context=(0,react.createContext)({});function useCellList(){const{items,getItem,append,move,insert,remove,update,selectedKeys,setSelectedKeys}=(0,data_dist_import.SH)({getKey:item=>item.id}),selectedKey=selectedKeys.values().next().value,focused=selectedKey?getItem(selectedKey):void 0;return(0,react.useLayoutEffect)((()=>{items.length>0&&(id=>{if(items.length<1)return;const sorted=[...items].sort(((a,b)=>a.anchorCell-b.anchorCell)),anchoredIndex=sorted.findIndex((c=>c.id===id));if(anchoredIndex<0)return;const updated=[];let max=sorted[anchoredIndex].anchorCell;for(let i=anchoredIndex-1;i>=0;i--){const current=sorted[i];max=Math.min(current.anchorCell+current.height,max),current.cell!==max-current.height&&(current.cell=max-current.height,updated.push(i)),max=current.cell}sorted[anchoredIndex].cell!==sorted[anchoredIndex].anchorCell&&(sorted[anchoredIndex].cell=sorted[anchoredIndex].anchorCell,updated.push(anchoredIndex));let min=sorted[anchoredIndex].anchorCell+sorted[anchoredIndex].height;for(let i=anchoredIndex+1;i<sorted.length;i++){const current=sorted[i];min=Math.max(current.anchorCell,min),current.cell!==min&&(current.cell=min,updated.push(i)),min=current.cell+current.height}updated.forEach((i=>update(sorted[i].id,sorted[i])))})(focused?focused.id:items[0].id)}),[items,focused]),console.log("useCellList",items),{items,focused,getItem,focus:id=>{getItem(id)&&setSelectedKeys(new Set([id]))},resetFocus:()=>{setSelectedKeys(new Set([]))},addItem:item=>{if(getItem(item.id))throw new Error("CellListItem already exists with ID: "+item.id);append(item)},removeItem:id=>{remove(id)},updateItem:(id,item)=>{update(id,item)}}}const AnimatedContainer=styled_components_browser_esm.ZP.div`
  transition: 200ms;
`;function AnchoredContainer({id,anchor,focused,gap,children}){const{getItem,addItem,removeItem,updateItem,focus}=(0,react.useContext)(Context),anchorPos=anchor?.target||{y:0,x:0,width:0,height:0},item=getItem(id),{ref,height}=useElementSize(),heightWithGap=height+gap;return(0,react.useEffect)((()=>{if(0!==anchorPos.y)return addItem({id,anchorCell:anchorPos.y,cell:anchorPos.y,height:heightWithGap}),()=>removeItem(id)}),[id,anchorPos.y]),(0,react.useEffect)((()=>{const item=getItem(id);if(item){const updated={...item};let changed=!1;heightWithGap!==item.height&&(console.log("change height",id),updated.height=heightWithGap,changed=!0),changed&&updateItem(id,updated),focused&&focus(id)}}),[id,anchorPos,heightWithGap,focused]),(0,jsx_runtime.jsx)(AnimatedContainer,{ref,style:{position:"absolute",transform:item?.cell?`translateY(${item?.cell??0}px) translateX(${focused?-20:0}px)`:void 0},children})}AnchoredContainer.displayName="AnchoredContainer";try{AnchoredContainer.displayName="AnchoredContainer",AnchoredContainer.__docgenInfo={description:"Responsible for keeping body content aligned with a target anchor.",displayName:"AnchoredContainer",props:{id:{defaultValue:null,description:"",name:"id",required:!0,type:{name:"string"}},anchor:{defaultValue:null,description:"",name:"anchor",required:!1,type:{name:"any"}},focused:{defaultValue:null,description:"",name:"focused",required:!0,type:{name:"boolean"}},gap:{defaultValue:null,description:"Additional spacing between adjacent containers",name:"gap",required:!0,type:{name:"number"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/AnchoredContainer/AnchoredContainer.tsx#AnchoredContainer"]={docgenInfo:AnchoredContainer.__docgenInfo,name:"AnchoredContainer",path:"src/components/AnchoredContainer/AnchoredContainer.tsx#AnchoredContainer"})}catch(__react_docgen_typescript_loader_error){}function Thread({node}){const ref=(0,react.useRef)(null),{getAnchor}=(0,useAnchorsContext.T)(),{hasActiveEditor}=(0,react.useContext)(useEditors._),body=node.body.find((b=>"TextualBody"===b.type)),state=node.body.find((b=>"Thread"===b.type)),anchor=getAnchor({id:"highlight"===node.target.selector?.subtype?node.id:void 0,source:node.target.source}),{focused,replies,focus,updateComment,resolve,reopen,remove,recover}=useThread(node.id),[isEditing,setEditing]=(0,react.useState)(!1),[isAutofocus,setAutofocus]=(0,react.useState)(!1),defaultValue=body.value,{deleted,recoverable,resolved}=state,isInitial=defaultValue.trim().length<1;(0,react.useEffect)((()=>{ref.current&&focused&&isInitial&&(setEditing(!0),setAutofocus(!0))}),[node,ref,focused,isInitial]);return(0,react.useEffect)((()=>{if(!ref.current)return;const onEnter=()=>{focus()};return ref.current.addEventListener("click",onEnter),()=>{ref.current?.removeEventListener("click",onEnter)}}),[ref,focus]),deleted&&recoverable?(0,jsx_runtime.jsxs)(index_module.Xk,{withBorder:!0,p:"xs",children:["Deleted thread."," ",(0,jsx_runtime.jsx)(index_module.rU,{as:"button",onClick:recover,children:"(undo)"})]}):deleted?null:(0,jsx_runtime.jsx)(AnchoredContainer,{id:node.id,anchor,focused,gap:16,children:(0,jsx_runtime.jsx)(index_module.Xk,{id:"thread-"+node.id,p:"xs",ml:"xl",ref,tabIndex:0,className:(0,index_module.cx)({"rui-border-2":!0,"rui-border-light":!focused,"rui-border-blue":focused}),w:400,children:(0,jsx_runtime.jsxs)(index_module.Kq,{align:"stretch",gap:"md",px:"xs",pb:"xs",children:[resolved&&(0,jsx_runtime.jsxs)(index_module.ZA,{justify:"apart",align:"center",children:[(0,jsx_runtime.jsx)(Profile,{node}),(0,jsx_runtime.jsxs)(index_module.ZA,{align:"center",children:[(0,jsx_runtime.jsxs)(index_module.Af,{variant:"outline",c:"green",children:[(0,jsx_runtime.jsx)(index_module.JO,{name:"check"})," resolved"]}),(0,jsx_runtime.jsx)(index_module.hU,{size:16,iconProps:{p:"xxs"},name:"rotate",label:"Reopen",onPress:reopen})]})]}),!resolved&&(0,jsx_runtime.jsxs)(index_module.ZA,{justify:"apart",align:"center",children:[(0,jsx_runtime.jsx)(Profile,{node,showRole:!0}),(0,jsx_runtime.jsxs)(index_module.v2,{label:(0,jsx_runtime.jsx)(jsx_runtime.Fragment,{}),onAction:key=>("resolve"===key?resolve():"delete"===key?remove():"edit"===key&&setEditing(!0),!0),disabledKeys:hasActiveEditor?["edit","resolve","delete"]:[],children:[(0,jsx_runtime.jsx)(index_module.ck,{children:"Edit comment"},"edit"),(0,jsx_runtime.jsx)(index_module.ck,{children:"Resolve thread"},"resolve"),(0,jsx_runtime.jsx)(index_module.ck,{children:(0,jsx_runtime.jsx)(index_module.xv,{c:"error",children:"Delete thread"})},"delete")]})]}),(0,jsx_runtime.jsxs)(index_module.xu,{pl:"sm",children:[isEditing?(0,jsx_runtime.jsx)(EditableMessage,{defaultValue,autosave:isAutofocus,onSave:message=>{"<p></p>"===message.trim()&&(message=""),updateComment(message),setEditing(!1),!message.length&&message.length<1&&remove(!1)},onCancel:()=>{setEditing(!1),defaultValue.length<1&&replies.length<1&&remove(!1)}}):(0,jsx_runtime.jsx)(ReadOnlyMessage,{message:defaultValue}),resolved&&replies.length>0&&!focused&&(0,jsx_runtime.jsx)(index_module.xv,{fs:"xs",fw:"bold",children:1===replies.length?"1 more reply":replies.length+" more replies"})]}),(!resolved||focused)&&replies.map((reply=>(0,jsx_runtime.jsx)(Reply,{thread:node,node:reply},reply.id))),!resolved&&!isInitial&&focused&&(0,jsx_runtime.jsx)(StartReply,{thread:node})]})})})}Thread.displayName="Thread";try{Thread.displayName="Thread",Thread.__docgenInfo={description:"",displayName:"Thread",props:{node:{defaultValue:null,description:"",name:"node",required:!0,type:{name:"Annotation"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Thread/Thread.tsx#Thread"]={docgenInfo:Thread.__docgenInfo,name:"Thread",path:"src/components/Thread/Thread.tsx#Thread"})}catch(__react_docgen_typescript_loader_error){}const ThreadList=(0,react.forwardRef)(((props,ref)=>{const{annotations}=(0,useAnnotationsContext.i)(),cellList=useCellList(),filtered=[...annotations.filter((a=>"replying"!==a.motivation))];return filtered.sort(((a,b)=>{const aItem=cellList.getItem(a.id),bItem=cellList.getItem(b.id);return aItem&&bItem?aItem.anchorCell-bItem.anchorCell:0})),(0,jsx_runtime.jsx)("div",{ref,children:(0,jsx_runtime.jsx)(Context.Provider,{value:cellList,children:filtered?.map((anno=>(0,jsx_runtime.jsx)(Thread,{node:anno},anno.id)))})})}));try{ThreadList.displayName="ThreadList",ThreadList.__docgenInfo={description:"",displayName:"ThreadList",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/ThreadList/ThreadList.tsx#ThreadList"]={docgenInfo:ThreadList.__docgenInfo,name:"ThreadList",path:"src/components/ThreadList/ThreadList.tsx#ThreadList"})}catch(__react_docgen_typescript_loader_error){}},"./src/hooks/useAnchors.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{_:()=>Context,q:()=>useAnchors});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_stately__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@react-stately/data/dist/import.mjs"),uuid__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/uuid/dist/esm-browser/v4.js");const Context=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({});function useAnchors(){const{items,append,update,remove}=(0,react_stately__WEBPACK_IMPORTED_MODULE_1__.SH)({getKey:item=>item.id});return(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)((()=>{const getAnchor=ref=>items.find((a=>ref.id===a.id||!ref.id&&a.source===ref.source));return console.log("updated anchors",items),{items,getAnchor,addAnchors:anchors=>{anchors.forEach((a=>{const existing=getAnchor(a);if(existing){if(existing.id===a.id&&existing.source===a.source&&existing.type===a.type&&existing.target.y===a.target.y)return;update(existing.id,{...existing,...a})}else append({...a,id:a.id??(0,uuid__WEBPACK_IMPORTED_MODULE_2__.Z)()})}))}}}),[items,append,update,remove])}},"./src/hooks/useAnchorsContext.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{T:()=>useAnchorsContext});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_useAnchors__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/hooks/useAnchors.ts");function useAnchorsContext(){return(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_useAnchors__WEBPACK_IMPORTED_MODULE_1__._)}},"./src/hooks/useAnnotationPicker.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{_:()=>Context,i:()=>useAnnotationPicker});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");const Context=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({});function useAnnotationPicker(){return(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(Context)}},"./src/hooks/useAnnotations.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{O:()=>useAnnotations,_:()=>Context});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),uuid__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/uuid/dist/esm-browser/v4.js"),react_stately__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/@react-stately/data/dist/import.mjs");const Context=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({});function useAnnotations(initialItems=[],agent,role){const{items,selectedKeys,getItem,append,update,setSelectedKeys}=(0,react_stately__WEBPACK_IMPORTED_MODULE_1__.SH)({initialItems,getKey:anno=>anno.id}),[isEditingComment,setIsEditingComment]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1);return(0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)((()=>{const focusedAnnotationID=selectedKeys.values().next().value;return{annotations:items,focused:focusedAnnotationID?getItem(focusedAnnotationID):void 0,isEditingComment,setIsEditingComment,focus(id){setSelectedKeys(new Set(id?[id]:[]))},createThread(source,motivation,selector,id){const now=(new Date).toISOString(),anno={"@context":"http://www.w3.org/ns/anno.jsonld",type:"Annotation",id:id??(0,uuid__WEBPACK_IMPORTED_MODULE_2__.Z)(),motivation,created:now,modified:now,creator:agent,target:{source,selector},body:[{type:"TextualBody",value:"",format:"text/html",language:"en"},{type:"Thread",role,requiresResponse:!1,resolved:!1,deleted:!1,recoverable:!0}]};return append(anno),setSelectedKeys(new Set([anno.id])),anno},createReply(source,message,id){const now=(new Date).toISOString(),anno={"@context":"http://www.w3.org/ns/anno.jsonld",type:"Annotation",id:id??(0,uuid__WEBPACK_IMPORTED_MODULE_2__.Z)(),motivation:"replying",created:now,modified:now,creator:agent,target:{source},body:[{type:"TextualBody",value:message,format:"text/html",language:"en"},{type:"ThreadReply",role,deleted:!1,recoverable:!0}]};return append(anno),anno},patch(id,action){const anno=getItem(id);update(id,action(anno))},updateBody:(type,id,action)=>{const anno=getItem(id);update(id,{...anno,body:anno.body.map((b=>b.type===type?action(b):b))})}}}),[items,isEditingComment,selectedKeys,agent,role])}},"./src/hooks/useAnnotationsContext.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{i:()=>useAnnotationsContext});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_useAnnotations__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/hooks/useAnnotations.ts");function useAnnotationsContext(){return(0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(_useAnnotations__WEBPACK_IMPORTED_MODULE_1__._)}},"./src/hooks/useEditors.ts":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{_:()=>Context,w:()=>useEditors});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");const Context=(0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)({});function useEditors(){const[hasActiveEditor,setActiveEditor]=(0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1);return{hasActiveEditor,setActiveEditor}}}}]);
//# sourceMappingURL=956.bc30cfb1.iframe.bundle.js.map