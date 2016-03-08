#include "autogensqlitebindings.hpp"
#include "cocos2d_specifics.hpp"
#include "SQLiteWrapper.h"

template<class T>
static bool dummy_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS_ReportError(cx, "Constructor for the requested class is not available, please refer to the API reference.");
    return false;
}

static bool empty_constructor(JSContext *cx, uint32_t argc, jsval *vp) {
    return false;
}

static bool js_is_native_obj(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    args.rval().setBoolean(true);
    return true;    
}
JSClass  *jsb_SQLiteStatement_class;
JSObject *jsb_SQLiteStatement_prototype;

bool js_autogensqlitebindings_SQLiteStatement_reset(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    SQLiteStatement* cobj = (SQLiteStatement *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_autogensqlitebindings_SQLiteStatement_reset : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->reset();
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_autogensqlitebindings_SQLiteStatement_reset : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_autogensqlitebindings_SQLiteStatement_execute(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    SQLiteStatement* cobj = (SQLiteStatement *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_autogensqlitebindings_SQLiteStatement_execute : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->execute();
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_autogensqlitebindings_SQLiteStatement_execute : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_autogensqlitebindings_SQLiteStatement_dataType(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    SQLiteStatement* cobj = (SQLiteStatement *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_autogensqlitebindings_SQLiteStatement_dataType : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_autogensqlitebindings_SQLiteStatement_dataType : Error processing arguments");
        int ret = (int)cobj->dataType(arg0);
        jsval jsret = JSVAL_NULL;
        jsret = int32_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_autogensqlitebindings_SQLiteStatement_dataType : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_autogensqlitebindings_SQLiteStatement_bind(JSContext *cx, uint32_t argc, jsval *vp)
{
    bool ok = true;
    SQLiteStatement* cobj = nullptr;

    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx);
    obj.set(args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    cobj = (SQLiteStatement *)(proxy ? proxy->ptr : nullptr);
    JSB_PRECONDITION2( cobj, cx, false, "js_autogensqlitebindings_SQLiteStatement_bind : Invalid Native Object");
    do {
        if (argc == 2) {
            int arg0 = 0;
            ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
            if (!ok) { ok = true; break; }
            double arg1 = 0;
            ok &= JS::ToNumber( cx, args.get(1), &arg1) && !isnan(arg1);
            if (!ok) { ok = true; break; }
            bool ret = cobj->bind(arg0, arg1);
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        if (argc == 2) {
            int arg0 = 0;
            ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
            if (!ok) { ok = true; break; }
            std::string arg1;
            ok &= jsval_to_std_string(cx, args.get(1), &arg1);
            if (!ok) { ok = true; break; }
            bool ret = cobj->bind(arg0, arg1);
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    do {
        if (argc == 2) {
            int arg0 = 0;
            ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
            if (!ok) { ok = true; break; }
            int arg1 = 0;
            ok &= jsval_to_int32(cx, args.get(1), (int32_t *)&arg1);
            if (!ok) { ok = true; break; }
            bool ret = cobj->bind(arg0, arg1);
            jsval jsret = JSVAL_NULL;
            jsret = BOOLEAN_TO_JSVAL(ret);
            args.rval().set(jsret);
            return true;
        }
    } while(0);

    JS_ReportError(cx, "js_autogensqlitebindings_SQLiteStatement_bind : wrong number of arguments");
    return false;
}
bool js_autogensqlitebindings_SQLiteStatement_nextRow(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    SQLiteStatement* cobj = (SQLiteStatement *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_autogensqlitebindings_SQLiteStatement_nextRow : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->nextRow();
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_autogensqlitebindings_SQLiteStatement_nextRow : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_autogensqlitebindings_SQLiteStatement_restartSelect(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    SQLiteStatement* cobj = (SQLiteStatement *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_autogensqlitebindings_SQLiteStatement_restartSelect : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->restartSelect();
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_autogensqlitebindings_SQLiteStatement_restartSelect : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_autogensqlitebindings_SQLiteStatement_bindNull(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    SQLiteStatement* cobj = (SQLiteStatement *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_autogensqlitebindings_SQLiteStatement_bindNull : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_autogensqlitebindings_SQLiteStatement_bindNull : Error processing arguments");
        bool ret = cobj->bindNull(arg0);
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_autogensqlitebindings_SQLiteStatement_bindNull : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_autogensqlitebindings_SQLiteStatement_valueInt(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    SQLiteStatement* cobj = (SQLiteStatement *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_autogensqlitebindings_SQLiteStatement_valueInt : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_autogensqlitebindings_SQLiteStatement_valueInt : Error processing arguments");
        int ret = cobj->valueInt(arg0);
        jsval jsret = JSVAL_NULL;
        jsret = int32_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_autogensqlitebindings_SQLiteStatement_valueInt : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_autogensqlitebindings_SQLiteStatement_valueString(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    SQLiteStatement* cobj = (SQLiteStatement *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_autogensqlitebindings_SQLiteStatement_valueString : Invalid Native Object");
    if (argc == 1) {
        int arg0 = 0;
        ok &= jsval_to_int32(cx, args.get(0), (int32_t *)&arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_autogensqlitebindings_SQLiteStatement_valueString : Error processing arguments");
        std::string ret = cobj->valueString(arg0);
        jsval jsret = JSVAL_NULL;
        jsret = std_string_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_autogensqlitebindings_SQLiteStatement_valueString : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_autogensqlitebindings_SQLiteStatement_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    SQLiteStatement* cobj = new (std::nothrow) SQLiteStatement();

    js_type_class_t *typeClass = js_get_type_from_native<SQLiteStatement>(cobj);

    // link the native object with the javascript object
    JS::RootedObject proto(cx, typeClass->proto.ref());
    JS::RootedObject parent(cx, typeClass->parentProto.ref());
    JS::RootedObject jsobj(cx, JS_NewObject(cx, typeClass->jsclass, proto, parent));
    js_proxy_t* p = jsb_new_proxy(cobj, jsobj);
    AddNamedObjectRoot(cx, &p->obj, "SQLiteStatement");
    args.rval().set(OBJECT_TO_JSVAL(jsobj));
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
    return true;
}


void js_SQLiteStatement_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (SQLiteStatement)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JS::RootedObject jsobj(cx, obj);
    jsproxy = jsb_get_js_proxy(jsobj);
    if (jsproxy) {
        SQLiteStatement *nobj = static_cast<SQLiteStatement *>(jsproxy->ptr);
        nproxy = jsb_get_native_proxy(jsproxy->ptr);

        if (nobj) {
            jsb_remove_proxy(nproxy, jsproxy);
            delete nobj;
        }
        else
            jsb_remove_proxy(nullptr, jsproxy);
    }
}
void js_register_autogensqlitebindings_SQLiteStatement(JSContext *cx, JS::HandleObject global) {
    jsb_SQLiteStatement_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_SQLiteStatement_class->name = "SQLiteStatement";
    jsb_SQLiteStatement_class->addProperty = JS_PropertyStub;
    jsb_SQLiteStatement_class->delProperty = JS_DeletePropertyStub;
    jsb_SQLiteStatement_class->getProperty = JS_PropertyStub;
    jsb_SQLiteStatement_class->setProperty = JS_StrictPropertyStub;
    jsb_SQLiteStatement_class->enumerate = JS_EnumerateStub;
    jsb_SQLiteStatement_class->resolve = JS_ResolveStub;
    jsb_SQLiteStatement_class->convert = JS_ConvertStub;
    jsb_SQLiteStatement_class->finalize = js_SQLiteStatement_finalize;
    jsb_SQLiteStatement_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PSG("__nativeObj", js_is_native_obj, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("reset", js_autogensqlitebindings_SQLiteStatement_reset, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("execute", js_autogensqlitebindings_SQLiteStatement_execute, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("dataType", js_autogensqlitebindings_SQLiteStatement_dataType, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("bind", js_autogensqlitebindings_SQLiteStatement_bind, 2, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("nextRow", js_autogensqlitebindings_SQLiteStatement_nextRow, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("restartSelect", js_autogensqlitebindings_SQLiteStatement_restartSelect, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("bindNull", js_autogensqlitebindings_SQLiteStatement_bindNull, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("valueInt", js_autogensqlitebindings_SQLiteStatement_valueInt, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("valueString", js_autogensqlitebindings_SQLiteStatement_valueString, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JSFunctionSpec *st_funcs = NULL;

    jsb_SQLiteStatement_prototype = JS_InitClass(
        cx, global,
        JS::NullPtr(),
        jsb_SQLiteStatement_class,
        js_autogensqlitebindings_SQLiteStatement_constructor, 0, // constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    // add the proto and JSClass to the type->js info hash table
    JS::RootedObject proto(cx, jsb_SQLiteStatement_prototype);
    jsb_register_class<SQLiteStatement>(cx, jsb_SQLiteStatement_class, proto, JS::NullPtr());
}

JSClass  *jsb_SQLiteWrapper_class;
JSObject *jsb_SQLiteWrapper_prototype;

bool js_autogensqlitebindings_SQLiteWrapper_begin(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    SQLiteWrapper* cobj = (SQLiteWrapper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_autogensqlitebindings_SQLiteWrapper_begin : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->begin();
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_autogensqlitebindings_SQLiteWrapper_begin : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_autogensqlitebindings_SQLiteWrapper_rollback(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    SQLiteWrapper* cobj = (SQLiteWrapper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_autogensqlitebindings_SQLiteWrapper_rollback : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->rollback();
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_autogensqlitebindings_SQLiteWrapper_rollback : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_autogensqlitebindings_SQLiteWrapper_directStatement(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    SQLiteWrapper* cobj = (SQLiteWrapper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_autogensqlitebindings_SQLiteWrapper_directStatement : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_autogensqlitebindings_SQLiteWrapper_directStatement : Error processing arguments");
        bool ret = cobj->directStatement(arg0);
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_autogensqlitebindings_SQLiteWrapper_directStatement : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_autogensqlitebindings_SQLiteWrapper_statement(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    SQLiteWrapper* cobj = (SQLiteWrapper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_autogensqlitebindings_SQLiteWrapper_statement : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_autogensqlitebindings_SQLiteWrapper_statement : Error processing arguments");
        SQLiteStatement* ret = cobj->statement(arg0);
        jsval jsret = JSVAL_NULL;
        if (ret) {
            jsret = OBJECT_TO_JSVAL(js_get_or_create_jsobject<SQLiteStatement>(cx, (SQLiteStatement*)ret));
        } else {
            jsret = JSVAL_NULL;
        };
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_autogensqlitebindings_SQLiteWrapper_statement : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_autogensqlitebindings_SQLiteWrapper_initializing(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    SQLiteWrapper* cobj = (SQLiteWrapper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_autogensqlitebindings_SQLiteWrapper_initializing : Invalid Native Object");
    if (argc == 3) {
        std::string arg0;
        std::string arg1;
        std::string arg2;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        ok &= jsval_to_std_string(cx, args.get(1), &arg1);
        ok &= jsval_to_std_string(cx, args.get(2), &arg2);
        JSB_PRECONDITION2(ok, cx, false, "js_autogensqlitebindings_SQLiteWrapper_initializing : Error processing arguments");
        std::string ret = cobj->initializing(arg0, arg1, arg2);
        jsval jsret = JSVAL_NULL;
        jsret = std_string_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_autogensqlitebindings_SQLiteWrapper_initializing : wrong number of arguments: %d, was expecting %d", argc, 3);
    return false;
}
bool js_autogensqlitebindings_SQLiteWrapper_commit(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    SQLiteWrapper* cobj = (SQLiteWrapper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_autogensqlitebindings_SQLiteWrapper_commit : Invalid Native Object");
    if (argc == 0) {
        bool ret = cobj->commit();
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_autogensqlitebindings_SQLiteWrapper_commit : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_autogensqlitebindings_SQLiteWrapper_lastError(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    SQLiteWrapper* cobj = (SQLiteWrapper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_autogensqlitebindings_SQLiteWrapper_lastError : Invalid Native Object");
    if (argc == 0) {
        std::string ret = cobj->lastError();
        jsval jsret = JSVAL_NULL;
        jsret = std_string_to_jsval(cx, ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_autogensqlitebindings_SQLiteWrapper_lastError : wrong number of arguments: %d, was expecting %d", argc, 0);
    return false;
}
bool js_autogensqlitebindings_SQLiteWrapper_open(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    JS::RootedObject obj(cx, args.thisv().toObjectOrNull());
    js_proxy_t *proxy = jsb_get_js_proxy(obj);
    SQLiteWrapper* cobj = (SQLiteWrapper *)(proxy ? proxy->ptr : NULL);
    JSB_PRECONDITION2( cobj, cx, false, "js_autogensqlitebindings_SQLiteWrapper_open : Invalid Native Object");
    if (argc == 1) {
        std::string arg0;
        ok &= jsval_to_std_string(cx, args.get(0), &arg0);
        JSB_PRECONDITION2(ok, cx, false, "js_autogensqlitebindings_SQLiteWrapper_open : Error processing arguments");
        bool ret = cobj->open(arg0);
        jsval jsret = JSVAL_NULL;
        jsret = BOOLEAN_TO_JSVAL(ret);
        args.rval().set(jsret);
        return true;
    }

    JS_ReportError(cx, "js_autogensqlitebindings_SQLiteWrapper_open : wrong number of arguments: %d, was expecting %d", argc, 1);
    return false;
}
bool js_autogensqlitebindings_SQLiteWrapper_constructor(JSContext *cx, uint32_t argc, jsval *vp)
{
    JS::CallArgs args = JS::CallArgsFromVp(argc, vp);
    bool ok = true;
    SQLiteWrapper* cobj = new (std::nothrow) SQLiteWrapper();

    js_type_class_t *typeClass = js_get_type_from_native<SQLiteWrapper>(cobj);

    // link the native object with the javascript object
    JS::RootedObject proto(cx, typeClass->proto.ref());
    JS::RootedObject parent(cx, typeClass->parentProto.ref());
    JS::RootedObject jsobj(cx, JS_NewObject(cx, typeClass->jsclass, proto, parent));
    js_proxy_t* p = jsb_new_proxy(cobj, jsobj);
    AddNamedObjectRoot(cx, &p->obj, "SQLiteWrapper");
    args.rval().set(OBJECT_TO_JSVAL(jsobj));
    if (JS_HasProperty(cx, jsobj, "_ctor", &ok) && ok)
        ScriptingCore::getInstance()->executeFunctionWithOwner(OBJECT_TO_JSVAL(jsobj), "_ctor", args);
    return true;
}


void js_SQLiteWrapper_finalize(JSFreeOp *fop, JSObject *obj) {
    CCLOGINFO("jsbindings: finalizing JS object %p (SQLiteWrapper)", obj);
    js_proxy_t* nproxy;
    js_proxy_t* jsproxy;
    JSContext *cx = ScriptingCore::getInstance()->getGlobalContext();
    JS::RootedObject jsobj(cx, obj);
    jsproxy = jsb_get_js_proxy(jsobj);
    if (jsproxy) {
        SQLiteWrapper *nobj = static_cast<SQLiteWrapper *>(jsproxy->ptr);
        nproxy = jsb_get_native_proxy(jsproxy->ptr);

        if (nobj) {
            jsb_remove_proxy(nproxy, jsproxy);
            delete nobj;
        }
        else
            jsb_remove_proxy(nullptr, jsproxy);
    }
}
void js_register_autogensqlitebindings_SQLiteWrapper(JSContext *cx, JS::HandleObject global) {
    jsb_SQLiteWrapper_class = (JSClass *)calloc(1, sizeof(JSClass));
    jsb_SQLiteWrapper_class->name = "SQLiteWrapper";
    jsb_SQLiteWrapper_class->addProperty = JS_PropertyStub;
    jsb_SQLiteWrapper_class->delProperty = JS_DeletePropertyStub;
    jsb_SQLiteWrapper_class->getProperty = JS_PropertyStub;
    jsb_SQLiteWrapper_class->setProperty = JS_StrictPropertyStub;
    jsb_SQLiteWrapper_class->enumerate = JS_EnumerateStub;
    jsb_SQLiteWrapper_class->resolve = JS_ResolveStub;
    jsb_SQLiteWrapper_class->convert = JS_ConvertStub;
    jsb_SQLiteWrapper_class->finalize = js_SQLiteWrapper_finalize;
    jsb_SQLiteWrapper_class->flags = JSCLASS_HAS_RESERVED_SLOTS(2);

    static JSPropertySpec properties[] = {
        JS_PSG("__nativeObj", js_is_native_obj, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_PS_END
    };

    static JSFunctionSpec funcs[] = {
        JS_FN("begin", js_autogensqlitebindings_SQLiteWrapper_begin, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("rollback", js_autogensqlitebindings_SQLiteWrapper_rollback, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("directStatement", js_autogensqlitebindings_SQLiteWrapper_directStatement, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("statement", js_autogensqlitebindings_SQLiteWrapper_statement, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("initializing", js_autogensqlitebindings_SQLiteWrapper_initializing, 3, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("commit", js_autogensqlitebindings_SQLiteWrapper_commit, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("lastError", js_autogensqlitebindings_SQLiteWrapper_lastError, 0, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FN("open", js_autogensqlitebindings_SQLiteWrapper_open, 1, JSPROP_PERMANENT | JSPROP_ENUMERATE),
        JS_FS_END
    };

    JSFunctionSpec *st_funcs = NULL;

    jsb_SQLiteWrapper_prototype = JS_InitClass(
        cx, global,
        JS::NullPtr(),
        jsb_SQLiteWrapper_class,
        js_autogensqlitebindings_SQLiteWrapper_constructor, 0, // constructor
        properties,
        funcs,
        NULL, // no static properties
        st_funcs);

    // add the proto and JSClass to the type->js info hash table
    JS::RootedObject proto(cx, jsb_SQLiteWrapper_prototype);
    jsb_register_class<SQLiteWrapper>(cx, jsb_SQLiteWrapper_class, proto, JS::NullPtr());
}

void register_all_autogensqlitebindings(JSContext* cx, JS::HandleObject obj) {
    // Get the ns
    JS::RootedObject ns(cx);
    get_or_create_js_obj(cx, obj, "sql", &ns);

    js_register_autogensqlitebindings_SQLiteWrapper(cx, ns);
    js_register_autogensqlitebindings_SQLiteStatement(cx, ns);
}

