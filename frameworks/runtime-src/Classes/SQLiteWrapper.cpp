/*
 SQLiteWrapper.cpp

 Copyright (C) 2004 René Nyffenegger

 This source code is provided 'as-is', without any express or implied
 warranty. In no event will the author be held liable for any damages
 arising from the use of this software.

 Permission is granted to anyone to use this software for any purpose,
 including commercial applications, and to alter it and redistribute it
 freely, subject to the following restrictions:

 1. The origin of this source code must not be misrepresented; you must not
 claim that you wrote the original source code. If you use this source code
 in a product, an acknowledgment in the product documentation would be
 appreciated but is not required.

 2. Altered source versions must be plainly marked as such, and must not be
 misrepresented as being the original source code.

 3. This notice may not be removed or altered from any source distribution.

 René Nyffenegger rene.nyffenegger@adp-gmbh.ch

 */
#include "SQLiteWrapper.h"
#include "cocos2d.h"
 //#include "CMD5Checksum.h"
USING_NS_CC;

SQLiteWrapper::SQLiteWrapper() : db_(0) {
}

bool SQLiteWrapper::open(std::string const& db_file) {
	if (sqlite3_open(db_file.c_str(), &db_) != SQLITE_OK) {
		return false;
	}
	return true;
}


/**
 * 初始化sqlite
 * 区分android ios 读取文件路径 直接通过该路径进行open
 */
std::string SQLiteWrapper::initializing(const std::string &db_file, const std::string &searchPath, const std::string &searchResolution)
{
	// 取出可写路径下的全路径
	std::string fullpath = FileUtils::getInstance()->getWritablePath() + db_file;
	bool isExist = FileUtils::getInstance()->isFileExist(fullpath.c_str());

	// 如果没有此文件则,从res路径下拷贝一个基础的db文件
	if (!isExist)
	{
		std::string basePath = "res/" + db_file;
		bool baseFileIsExist = FileUtils::getInstance()->isFileExist(basePath.c_str());
		if (!baseFileIsExist)
		{
			basePath = "res/base.db";
			baseFileIsExist = FileUtils::getInstance()->isFileExist(basePath.c_str());
		}

		cocos2d::log("basePath : %s", basePath.c_str());
		cocos2d::log("fullpath : %s", fullpath.c_str());

		if (baseFileIsExist)
		{
			cocos2d::log("基础文件存在可以拷贝");
			auto data = FileUtils::getInstance()->getDataFromFile(basePath.c_str());

			cocos2d::log("data size ----------%d", data.getSize());
			FILE* dest = fopen(fullpath.c_str(), "wb");
			fwrite(data.getBytes(), 1, data.getSize(), dest);
			fclose(dest);
			cocos2d::log("write ok----------%s", fullpath.c_str());
		}
	}

	bool result = this->open(fullpath);
	cocos2d::log("Database open status : %d", result);
	cocos2d::log("full path is %s", fullpath.c_str());

	return fullpath;
}

SQLiteStatement* SQLiteWrapper::statement(std::string const& statement) {
	SQLiteStatement* stmt;
	try {
		stmt = new SQLiteStatement(statement, db_);
		return stmt;
	}
	catch (const char* e) {
		return 0;
	}
}

SQLiteStatement::SQLiteStatement(std::string const& statement, sqlite3* db) {
	if (sqlite3_prepare(
		db,
		statement.c_str(),  // stmt
		-1,                  // If than zero, then stmt is read up to the first nul terminator
		&stmt_,
		0                   // Pointer to unused portion of stmt
		)
		!= SQLITE_OK) {
		cocos2d::log("Fun SQLiteStatement::SQLiteStatement(std::string const& statement, sqlite3* db) ErrorCode %s", sqlite3_errmsg(db));
		throw sqlite3_errmsg(db);
	}

	if (!stmt_) {
		cocos2d::log("Fun SQLiteStatement::SQLiteStatement(std::string const& statement, sqlite3* db) ErrorCode stmt_ is 0");
		throw "stmt_ is 0";
	}
	cocos2d::log("stmt_ is OK  ");
}

SQLiteStatement::~SQLiteStatement() {
	// Hubert Castelain 28/8/2005
	// Prevent the database remaining locked after some statement.
	// syntax: int sqlite3_finalize(sqlite3_stmt *pStmt);
	if (stmt_) sqlite3_finalize(stmt_);
}

SQLiteStatement::SQLiteStatement() :
	stmt_(0)
{
}

bool SQLiteStatement::bind(int pos_zero_indexed, std::string const& value) {
	if (sqlite3_bind_text(
		stmt_,
		pos_zero_indexed + 1,  // Index of wildcard
		value.c_str(),
		value.length(),      // length of text
		SQLITE_TRANSIENT     // SQLITE_TRANSIENT: SQLite makes its own copy
		)
		!= SQLITE_OK) {
		return false;
	}
	return true;
}

bool SQLiteStatement::bind(int pos_zero_indexed, double value) {
	if (sqlite3_bind_double(
		stmt_,
		pos_zero_indexed + 1,  // Index of wildcard
		value
		)
		!= SQLITE_OK) {
		return false;
	}
	return true;
}

bool SQLiteStatement::bind(int pos_zero_indexed, int value) {
	if (sqlite3_bind_int(
		stmt_,
		pos_zero_indexed + 1,  // Index of wildcard
		value
		)
		!= SQLITE_OK) {
		return false;
	}
	return true;
}

bool SQLiteStatement::bindNull(int pos_zero_indexed) {
	if (sqlite3_bind_null(
		stmt_,
		pos_zero_indexed + 1  // Index of wildcard
		)
		!= SQLITE_OK) {
		return false;
	}
	return true;
}

bool SQLiteStatement::execute() {
	int rc = sqlite3_step(stmt_);
	if (rc == SQLITE_BUSY) {
		return false;
	}
	if (rc == SQLITE_ERROR) {
		return false;
	}
	if (rc == SQLITE_MISUSE) {
		return false;
	}
	if (rc != SQLITE_DONE) {
		//sqlite3_reset(stmt_);
		return false;
	}
	sqlite3_reset(stmt_);
	return true;
}

SQLiteStatement::DataType SQLiteStatement::dataType(int pos_zero_indexed) {
	return dataType(sqlite3_column_type(stmt_, pos_zero_indexed));
}

int SQLiteStatement::valueInt(int pos_zero_indexed) {
	return sqlite3_column_int(stmt_, pos_zero_indexed);
}

std::string SQLiteStatement::valueString(int pos_zero_indexed) {

	if (sqlite3_column_text(stmt_, pos_zero_indexed) == NULL) {
		return std::string("null");
	}

	return std::string(reinterpret_cast<const char*>(sqlite3_column_text(stmt_, pos_zero_indexed)));
}

bool SQLiteStatement::restartSelect() {
	sqlite3_reset(stmt_);
	return true;
}

bool SQLiteStatement::reset() {
	int rc = sqlite3_step(stmt_);

	sqlite3_reset(stmt_);

	if (rc == SQLITE_ROW) return true;
	return false;
}

bool SQLiteStatement::nextRow() {
	int rc = sqlite3_step(stmt_);

	if (rc == SQLITE_ROW) {
		return true;
	}
	if (rc == SQLITE_DONE) {
		sqlite3_reset(stmt_);
		return false;
	}
	else if (rc == SQLITE_MISUSE) {
		cocos2d::log("sqlite status: %s", "SQLITE_MISUSE");
	}
	else if (rc == SQLITE_BUSY) {
		cocos2d::log("sqlite status: %s", "SQLITE_BUSY");
	}
	else if (rc == SQLITE_ERROR) {
		cocos2d::log("sqlite status: %s", "SQLITE_ERROR");
	}
	return false;
}

bool SQLiteWrapper::directStatement(std::string const& stmt) {
	char *errmsg;
	int   ret;

	ret = sqlite3_exec(db_, stmt.c_str(), 0, 0, &errmsg);

	if (ret != SQLITE_OK) {
		return false;
	}
	return true;
}

std::string SQLiteWrapper::lastError() {
	return sqlite3_errmsg(db_);
}

bool SQLiteWrapper::begin() {
	return directStatement("begin");
}

bool SQLiteWrapper::commit() {
	return directStatement("commit");
}

bool SQLiteWrapper::rollback() {
	return directStatement("rollback");
}