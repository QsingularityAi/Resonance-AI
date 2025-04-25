"""
Copyright (c) 2024 Helm & Walter IT-Solutions
PROPRIETARY AND CONFIDENTIAL

This component and any modifications thereof remain the exclusive property of
Helm & Walter IT-Solutions. A non-exclusive, non-transferable license is granted
solely for the purpose of operating the delivered solution in its intended way.

While source code is provided, any use, copying, modification, distribution or
reuse outside the intended solution it was shipped with is strictly prohibited.
All rights reserved.

Version: 1.0.0
Initial version: 1.0.0 (2024-11-27) Bernd Helm (bernd.helm@helmundwalter.de)
"""
import os
from magic_pdf.rw.AbsReaderWriter import AbsReaderWriter
from loguru import logger


class DiskReaderWriter(AbsReaderWriter):
    def __init__(self, parent_path, encoding="utf-8"):
        self.path = parent_path
        self.encoding = encoding

    def read(self, path, mode=AbsReaderWriter.MODE_BIN):
        if os.path.isabs(path):
            abspath = path
        else:
            abspath = os.path.join(self.path, path)
        if not os.path.exists(abspath):
            logger.error(f"file {abspath} not exists")
            raise Exception(f"file {abspath} no exists")
        if mode == AbsReaderWriter.MODE_TXT:
            with open(abspath, "r", encoding=self.encoding) as f:
                return f.read()
        elif mode == AbsReaderWriter.MODE_BIN:
            with open(abspath, "rb") as f:
                return f.read()
        else:
            raise ValueError("Invalid mode. Use 'text' or 'binary'.")

    def write(self, content, path, mode=AbsReaderWriter.MODE_BIN):
        # Detect if parameters are swapped by checking types
        if isinstance(content, (bytes, bytearray)) and isinstance(path, str):
            # Parameters are correct, continue
            pass
        elif isinstance(path, (bytes, bytearray)) and isinstance(content, str):
            # Parameters are swapped, fix them
            content, path = path, content
        if os.path.isabs(path):
            abspath = path
        else:
            abspath = os.path.join(self.path, path)
        directory_path = os.path.dirname(abspath)
        if not os.path.exists(directory_path):
            os.makedirs(directory_path)
        if mode == AbsReaderWriter.MODE_TXT:
            with open(abspath, "w", encoding=self.encoding, errors="replace") as f:
                f.write(content)

        elif mode == AbsReaderWriter.MODE_BIN:
            with open(abspath, "wb") as f:
                f.write(content)
        else:
            raise ValueError("Invalid mode. Use 'text' or 'binary'.")

    def read_offset(self, path: str, offset=0, limit=None):
        abspath = path
        if not os.path.isabs(path):
            abspath = os.path.join(self.path, path)
        with open(abspath, "rb") as f:
            f.seek(offset)
            return f.read(limit)
