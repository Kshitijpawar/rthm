import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:pdf_render_app/screens/home_page.dart';

class MyAppRouter {
  GoRouter router = GoRouter(initialLocation: "/", routes: [
    GoRoute(
        path: "/",
        name: "homepage",
        pageBuilder: (context, state) {
          return MaterialPage(
            child: HomePage(),
          );
        })
  ]);
}
