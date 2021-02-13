// Copyright (c) 2021 The Chromium Embedded Framework Authors. All rights
// reserved. Use of this source code is governed by a BSD-style license that
// can be found in the LICENSE file.
//
// ---------------------------------------------------------------------------
//
// This file was generated by the CEF translator tool. If making changes by
// hand only do so within the body of existing method and function
// implementations. See the translator.README.txt file in the tools directory
// for more information.
//
// $hash=868c4d33bd4776ca5f2044d2707f2a78f16bd074$
//

#ifndef CEF_LIBCEF_DLL_CTOCPP_SELECT_CLIENT_CERTIFICATE_CALLBACK_CTOCPP_H_
#define CEF_LIBCEF_DLL_CTOCPP_SELECT_CLIENT_CERTIFICATE_CALLBACK_CTOCPP_H_
#pragma once

#if !defined(WRAPPING_CEF_SHARED)
#error This file can be included wrapper-side only
#endif

#include "include/capi/cef_request_handler_capi.h"
#include "include/cef_request_handler.h"
#include "libcef_dll/ctocpp/ctocpp_ref_counted.h"

// Wrap a C structure with a C++ class.
// This class may be instantiated and accessed wrapper-side only.
class CefSelectClientCertificateCallbackCToCpp
    : public CefCToCppRefCounted<CefSelectClientCertificateCallbackCToCpp,
                                 CefSelectClientCertificateCallback,
                                 cef_select_client_certificate_callback_t> {
 public:
  CefSelectClientCertificateCallbackCToCpp();
  virtual ~CefSelectClientCertificateCallbackCToCpp();

  // CefSelectClientCertificateCallback methods.
  void Select(CefRefPtr<CefX509Certificate> cert) OVERRIDE;
};

#endif  // CEF_LIBCEF_DLL_CTOCPP_SELECT_CLIENT_CERTIFICATE_CALLBACK_CTOCPP_H_
